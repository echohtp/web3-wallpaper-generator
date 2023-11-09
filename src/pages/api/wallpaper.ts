// pages/api/wallpaper.ts
import { NextApiRequest, NextApiResponse } from 'next';
import sharp, { Blend } from 'sharp';
import fetch from 'node-fetch';

// Define dimensions for different phone models
const phoneDimensions: { [key: string]: { width: number; height: number } } = {
  iphone_13_pro: { width: 1170, height: 2532 },
  iphone_13: { width: 1170, height: 2532 },
  samsung_galaxy_s21: { width: 1080, height: 2400 },
  google_pixel_6: { width: 1080, height: 2340 },
  oneplus_9: { width: 1080, height: 2400 },
  samsung_galaxy_note_20: { width: 1080, height: 2400 },
  xiaomi_mi_11: { width: 1080, height: 2400 },
  oppo_find_x3_pro: { width: 1440, height: 3216 },
  sony_xperia_1_iii: { width: 1644, height: 3840 },
  solana_saga: { width: 1080, height: 2400 }, // Replace with actual dimensions
};


const collectionLogos: { [key: string]: string } = {
  'Mad Lads': 'src/logos/Mad Lads1.png',
  // Add more collections and their corresponding logo paths
};

async function applyGradientOverlay(imageBuffer: Buffer, dimensions: any): Promise<Buffer> {
  // Create an SVG gradient
  const gradientSVG = `
    <svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,1);" />
          <stop offset="50%" style="stop-color:rgba(255,255,255,0);" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0);" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#fadeGradient)" />
    </svg>`;

  // Convert SVG gradient to PNG
  const gradientBuffer = await sharp(Buffer.from(gradientSVG))
    .toFormat('png')
    .toBuffer();

  // Composite the gradient over the image
  const imageWithGradient = await sharp(imageBuffer)
    .composite([{ input: gradientBuffer, blend: 'over' }])
    .toBuffer();

  return imageWithGradient;
}


async function fetchNFTImage(collection: string, id: string): Promise<Buffer> {
  const nftResponse = await fetch(`http://localhost:3000/api/nft?collection=${collection}&id=${id}`);
  if (!nftResponse.ok) {
    throw new Error(`NFT API responded with status: ${nftResponse.status}`);
  }
  const { imageUrl } = await nftResponse.json();
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Image fetch responded with status: ${imageResponse.status}`);
  }
  return Buffer.from(await imageResponse.arrayBuffer());
}

async function getTileImage(id: string): Promise<Buffer> {
  const jsonUrl = `https://madlads.s3.us-west-2.amazonaws.com/json/${id}.json`;
  const response = await fetch(jsonUrl);
  const json = await response.json();
  const backgroundAttribute = json.attributes.find(attr => attr.trait_type === "Background");
  return sharp(`src/bg/${backgroundAttribute.value}-bkg.png`).toBuffer();
}


async function createWallpaper(imageBuffer: Buffer, dimensions, backgroundImageBuffer: Buffer, collectionName: string): Promise<Buffer> {
  // Resize the background image to cover the dimensions of the wallpaper
  const resizedBackground = await sharp(backgroundImageBuffer)
    .resize(dimensions.width, dimensions.height, {
      fit: 'cover'
    })
    .toBuffer();

  // Resize the NFT image if it's larger than the background
  const originalImageMetadata = await sharp(imageBuffer).metadata();
  let resizedNftImageBuffer = imageBuffer;
  if (originalImageMetadata.width > dimensions.width || originalImageMetadata.height > dimensions.height) {
    resizedNftImageBuffer = await sharp(imageBuffer)
      .resize({
        width: dimensions.width,
        height: dimensions.height,
        fit: 'inside', // This ensures the image is resized proportionally
        withoutEnlargement: true // This ensures the image is not enlarged
      })
      .toBuffer();
  }

  // Calculate position to center the resized NFT image on the background
  const resizedImageMetadata = await sharp(resizedNftImageBuffer).metadata();
  const left = (dimensions.width - resizedImageMetadata.width) / 2;
  const top = (dimensions.height - resizedImageMetadata.height) / 2;

  // Composite the resized NFT image over the resized background
  let finalImageBuffer = await sharp(resizedBackground)
    .composite([{ input: resizedNftImageBuffer, left: Math.round(left), top: Math.round(dimensions.height - resizedImageMetadata.height) }])
    .toBuffer();


   // If the collection has a corresponding logo, add it to the image
   const logoPath = collectionLogos[collectionName];
   if (logoPath) {
    // Determine the size of the logo, e.g., 10% of the wallpaper width
    const logoWidth = dimensions.width * 0.25;
    const logoHeight = dimensions.height * 0.25; // or maintain aspect ratio

    // Load and resize the logo
    const logoBuffer = await sharp(logoPath)
      .resize({
        width: logoWidth,
        height: logoHeight,
        fit: 'contain', // This will maintain the aspect ratio
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background for the contain fit
      })
      .toBuffer();


    // Get metadata of the resized logo to calculate the top offset
    const logoMetadata = await sharp(logoBuffer).metadata();
    // Composite the logo onto the final image buffer
    // Position the logo at the bottom-right corner of the image, or adjust as needed
    const logoMargin = 20; // Margin from the edges in pixels
    finalImageBuffer = await sharp(finalImageBuffer)
      .composite([{
        input: logoBuffer,
        left: (dimensions.width - logoWidth) / 2,
        top: dimensions.height * 0.3 - logoMetadata.height / 2,
        // gravity: 'southeast' // This positions the logo at the bottom-right
      }])
      .toBuffer();
  }


  return finalImageBuffer;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { model, collection, id } = req.query;
    if (typeof collection !== 'string' || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing collection or NFT ID' });
    }
    const dimensions = phoneDimensions[model as keyof typeof phoneDimensions];
    if (!dimensions) {
      return res.status(400).json({ error: 'Invalid phone model' });
    }

    let imageBuffer = await fetchNFTImage(collection, id);
    let tileImageBuffer;
    if (collection === "Mad Lads") {
      
      tileImageBuffer = await getTileImage(id);
      const originalImageMetadata = await sharp(imageBuffer).metadata();
      // imageBuffer = await applyGradientOverlay(imageBuffer, {width: originalImageMetadata.width, height: originalImageMetadata.height * 0.1});
    }

    const finalImage = await createWallpaper(imageBuffer, dimensions, tileImageBuffer, collection);
    res.setHeader('Content-Type', 'image/png');
    res.send(finalImage);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
}
