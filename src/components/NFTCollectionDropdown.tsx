// components/NFTCollectionDropdown.tsx
import React from 'react';

interface NFTCollectionDropdownProps {
  collections: string[];
  onChange: (value: string) => void;
}

const NFTCollectionDropdown: React.FC<NFTCollectionDropdownProps> = ({ collections, onChange }) => {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      defaultValue=""
    >
      <option value="" disabled>
        Select NFT Collection
      </option>
      {collections.map((collection, index) => (
        <option key={index} value={collection}>
          {collection}
        </option>
      ))}
    </select>
  );
};

export default NFTCollectionDropdown;
