// pages/index.tsx
import React, { useState, useEffect } from 'react';
import PhoneModelDropdown from '../components/PhoneModelDropdown';
import NFTCollectionDropdown from '../components/NFTCollectionDropdown';
import Spinner from '../components/Spinner';


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
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center items-center">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5">
            <h3 className="text-xl leading-6 font-semibold text-gray-900">
              Phone Wallpaper Generator
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Personalize your phone with a unique wallpaper from your favorite NFT collection.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 gap-6">
                <div className="col-span-1">
                  <label htmlFor="phone-model" className="block text-sm font-medium text-gray-700">
                    Select your phone model
                  </label>
                  <div className="mt-1">
                    <PhoneModelDropdown onChange={setPhoneModel} />
                  </div>
                </div>
                <div className="col-span-1">
                  <label htmlFor="nft-collection" className="block text-sm font-medium text-gray-700">
                    Choose NFT collection
                  </label>
                  <div className="mt-1">
                    <NFTCollectionDropdown collections={nftCollections} onChange={setNftCollection} />
                  </div>
                </div>
                <div className="col-span-1">
                  <label htmlFor="nft-id" className="block text-sm font-medium text-gray-700">
                    Enter NFT ID
                  </label>
                  <div className="mt-1">
                    <input
                      id="nft-id"
                      type="number"
                      value={nftId}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (value.startsWith('0') && value.length > 1) {
                          value = value.substring(1);
                        }
                        setNftId(value);
                      }}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="1234"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={downloadWallpaper}
          >
            Generate Wallpaper
          </button>
        </div>
  
        {/* Wallpaper display section
        <div className="mt-6">
          {isLoading ? (
            <Spinner />
          ) : (
            wallpaperUrl && (
              <div className="flex justify-center mt-4">
                <img
                  src={wallpaperUrl}
                  alt="Generated Wallpaper"
                  className="rounded-lg shadow-lg"
                />
              </div>
            )
          )}
        </div> */}
      </div>
    </div>
  );
  
};

export default Home;
