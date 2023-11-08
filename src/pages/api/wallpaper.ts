// pages/api/wallpaper.ts
import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { model, collection, id } = req.query;

  if (typeof collection !== 'string' || typeof id !== 'string' || !collection || !id) {
    res.status(400).json({ error: 'Invalid or missing collection or NFT ID' });
    return;
  }

  const dimensions = phoneDimensions[model as string];
  if (!dimensions) {
    res.status(400).json({ error: 'Invalid phone model' });
    return;
  }

  try {
    // Call the /api/nft endpoint to get the NFT image
    const nftResponse = await fetch(`http://localhost:3000/api/nft?collection=${collection}&id=${id}`);
    if (!nftResponse.ok) {
      throw new Error(`NFT API responded with status: ${nftResponse.status}`);
    }

    let nftImageUrl = await nftResponse.json();
    //@ts-ignore
    nftImageUrl = nftImageUrl.imageUrl

    const imageResponse = await fetch(nftImageUrl)
    if (!nftResponse.ok) {
      throw new Error(`NFT API responded with status: ${nftResponse.status}`);
    }
    const imageResponseBuffer = await imageResponse.buffer();


    // Sample the color at position (0,0)
    const color = await sharp(imageResponseBuffer).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
    const [red, green, blue] = color;

    // Create a new image with the sampled color as the background
    const wallpaper = sharp({
      create: {
        width: dimensions.width,
        height: dimensions.height,
        channels: 4,
        background: { r: red, g: green, b: blue, alpha: 1 },
      },
    }).png();

    // Get metadata of the NFT image
    const originalImage = await sharp(imageResponseBuffer).metadata();

    // Resize the NFT image if it's larger than the background
    let resizedNftImageBuffer = imageResponseBuffer;
    if (originalImage.width! > dimensions.width || originalImage.height! > dimensions.height) {
      resizedNftImageBuffer = await sharp(imageResponseBuffer)
        .resize({
          width: dimensions.width,
          height: dimensions.height,
          fit: 'inside', // This ensures the image is resized proportionally
        })
        .toBuffer();
    }

    // Calculate position to center the resized image
    const resizedImageMetadata = await sharp(resizedNftImageBuffer).metadata();
    const left = (dimensions.width - resizedImageMetadata.width!) / 2;
    const top = (dimensions.height - resizedImageMetadata.height!) / 2;

    // Composite the resized NFT image over the background
    const finalImage = await wallpaper
      .composite([{ input: resizedNftImageBuffer, left: Math.round(left), top: Math.round(top) }])
      .toBuffer();

    // Send the final image to the user
    res.setHeader('Content-Type', 'image/png');
    res.send(finalImage);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
}