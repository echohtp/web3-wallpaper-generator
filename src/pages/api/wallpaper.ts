// pages/api/wallpaper.ts
import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

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
  const { model } = req.query;
  const dimensions = phoneDimensions[model as string];

  if (!dimensions) {
    res.status(400).json({ error: 'Invalid phone model' });
    return;
  }

  const { width, height } = dimensions;

  const { collection, id } = req.query;


   // Here you would implement the logic to fetch or generate the NFT image
  // based on the collection and ID. For now, we'll just return a placeholder image.

  // Placeholder for the NFT image logic
  const nftImage = `<svg width="${width}" height="${height}">
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24">
      ${collection} #${id}
    </text>
  </svg>`;


  const buffer = await sharp(Buffer.from(nftImage))
    .png()
    .toBuffer();

  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
}
