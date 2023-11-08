// pages/index.tsx
import React, { useState, useEffect } from 'react';
import PhoneModelDropdown from '../components/PhoneModelDropdown';
import NFTCollectionDropdown from '../components/NFTCollectionDropdown';
import Spinner from '../components/Spinner'; // Make sure to create this component


const Home: React.FC = () => {
  const [phoneModel, setPhoneModel] = useState('');
  const [nftCollection, setNftCollection] = useState('');
  const [nftId, setNftId] = useState('');
  const [nftImageUrl, setNftImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const nftCollections = ['Mad Lads']; // Add more collections as needed

  const downloadWallpaper = async () => {
    // Include the phone model and NFT details in the API request
    const response = await fetch(`/api/wallpaper?model=${phoneModel}&collection=${nftCollection}&id=${nftId}`);
    const blob = await response.blob();
    const href = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `wallpaper-${phoneModel}-${nftCollection}-${nftId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchNftImage = async () => {
      if (nftId && nftCollection) {
        setIsLoading(true); // Start loading
        try {
          const response = await fetch(`/api/nft?collection=${nftCollection}&id=${nftId}`);
          const data = await response.json();
          if (data.imageUrl) {
            setNftImageUrl(data.imageUrl);
          }
        } catch (error) {
          console.error('Failed to fetch NFT image:', error);
          // Handle errors appropriately in your UI
        }
        setIsLoading(false); // Stop loading
      }
    };

    fetchNftImage();
  }, [nftId, nftCollection]); // This effect runs when nftId or nftCollection changes


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Phone Wallpaper Generator</h1>
      <PhoneModelDropdown onChange={setPhoneModel} />
      <NFTCollectionDropdown collections={nftCollections} onChange={setNftCollection} />
      {nftCollection && (
        <input
          type="number"
          placeholder="Enter NFT ID"
          min="0" // Only allow numbers greater than 0
          className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 mt-4"
          onChange={(e) => setNftId(e.target.value)}
          value={nftId}
        />
      )}
          <div className="mt-4">
        {isLoading ? (
          <Spinner /> // Your spinner component
        ) : (
          nftImageUrl && <img src={nftImageUrl} alt={`NFT ${nftId}`} className="max-w-xs mx-auto" />
        )}
      </div>
      <button
        onClick={downloadWallpaper}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
        disabled={!phoneModel || !nftCollection || !nftId}
      >
        Generate Wallpaper
      </button>
    </div>
  );
};

export default Home;
