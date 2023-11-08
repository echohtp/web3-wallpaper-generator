// components/PhoneModelDropdown.tsx
import React from 'react';

interface PhoneModelDropdownProps {
  onChange: (value: string) => void;
}

const phoneModels = [
  { id: 'iphone_13_pro', name: 'iPhone 13 Pro' },
  { id: 'iphone_13', name: 'iPhone 13' },
  { id: 'samsung_galaxy_s21', name: 'Samsung Galaxy S21' },
  { id: 'google_pixel_6', name: 'Google Pixel 6' },
  { id: 'oneplus_9', name: 'OnePlus 9' },
  { id: 'samsung_galaxy_note_20', name: 'Samsung Galaxy Note 20' },
  { id: 'xiaomi_mi_11', name: 'Xiaomi Mi 11' },
  { id: 'oppo_find_x3_pro', name: 'OPPO Find X3 Pro' },
  { id: 'sony_xperia_1_iii', name: 'Sony Xperia 1 III' },
  { id: 'solana_saga', name: 'Solana Saga' }, // Assuming this is the name of the phone
];


const PhoneModelDropdown: React.FC<PhoneModelDropdownProps> = ({ onChange }) => {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      className="block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
    >
      {phoneModels.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  );
};

export default PhoneModelDropdown;
