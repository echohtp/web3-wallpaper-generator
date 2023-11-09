// pages/api/wallpaper.ts
import { NextApiRequest, NextApiResponse } from 'next';
import sharp, { Blend } from 'sharp';
import fetch from 'node-fetch';

// Define dimensions for different phone models
const phoneDimensions = {
  iphone_13_pro: { width: 1170, height: 2532 },
  // ... other phone models
  solana_saga: { width: 1080, height: 2400 }, // Replace with actual dimensions
};

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


async function createWallpaper(imageBuffer: Buffer, dimensions, backgroundImageBuffer: Buffer): Promise<Buffer> {
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
  const finalImageBuffer = await sharp(resizedBackground)
    .composite([{ input: resizedNftImageBuffer, left: Math.round(left), top: Math.round(dimensions.height - resizedImageMetadata.height) }])
    .toBuffer();

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

    const imageBuffer = await fetchNFTImage(collection, id);
    let tileImageBuffer;
    if (collection === "Mad Lads") {
      tileImageBuffer = await getTileImage(id);
    }

    const finalImage = await createWallpaper(imageBuffer, dimensions, tileImageBuffer);
    res.setHeader('Content-Type', 'image/png');
    res.send(finalImage);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
}
