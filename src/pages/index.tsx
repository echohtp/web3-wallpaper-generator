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
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Phone Wallpaper Generator
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personalize your phone with a unique wallpaper from your favorite NFT collection.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Select your phone model
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <PhoneModelDropdown onChange={setPhoneModel} />
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Choose NFT collection
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <NFTCollectionDropdown collections={nftCollections} onChange={setNftCollection} />
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Enter NFT ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <input
                    type="number"
                    value={nftId}
                    onChange={(e) => setNftId(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="1234"
                  />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={downloadWallpaper}
          >
            Generate Wallpaper
          </button>
        </div>

        {/* <div className="mt-8">
          {isLoading ? (
            <Spinner />
          ) : (
            wallpaperUrl && (
              <img
                src={wallpaperUrl}
                alt="Generated Wallpaper"
                className="mx-auto"
              />
            )
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Home;
