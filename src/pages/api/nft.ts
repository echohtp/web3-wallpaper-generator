// pages/api/nft.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Helius } from "helius-sdk";


const helius = new Helius("<your-api-key-here>"); // input your api key generated from dev.helius.xyz here

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { collection, id } = req.query;
  let imageUrl = ""
  if (collection == "Mad Lads"){
    // Metadata URL Format
    // https://madlads.s3.us-west-2.amazonaws.com/json/9904.json
    imageUrl = `https://madlads.s3.us-west-2.amazonaws.com/images/${id}.png`
  }

  // Here you would implement the logic to fetch the NFT image URL
  // based on the collection and ID. This is just a placeholder.
  // You would replace this with actual logic to get the NFT data.

  res.status(200).json({ imageUrl });
}
