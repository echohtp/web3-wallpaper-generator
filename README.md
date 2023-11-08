# Wallpaper Generator Web App

This repository contains the source code for a wallpaper generator web application. The app allows users to select a phone model, choose an NFT collection, enter an NFT ID, and generate a phone wallpaper with the NFT image centered on a background color sampled from the image itself.

## Features

- Selection of popular phone models including the Solana Saga.
- Dropdown to choose from a list of NFT collections.
- Input for specifying the NFT ID to fetch the corresponding image.
- Generation of a wallpaper with the NFT image centered on a dynamically created background.
- Responsive design using Tailwind CSS for a seamless experience on various devices.

## Tech Stack

- **Next.js**: A React framework for building server-side rendering and static web applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
- **Sharp**: A high-performance Node.js module to convert large images in common formats to smaller, web-friendly JPEG, PNG, WebP, GIF, and AVIF images of varying dimensions.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/echohtp/wallpaper-generator.git
cd wallpaper-generator
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Select your phone model from the dropdown list.
2. Choose an NFT collection from the next dropdown.
3. Enter the NFT ID for the NFT you wish to use as a wallpaper.
4. Click the "Generate Wallpaper" button.
5. The generated wallpaper will be displayed on the screen.

## API Reference

### Generate Wallpaper

`GET /api/wallpaper?model={phoneModel}&collection={nftCollection}&id={nftId}`

Generates a wallpaper based on the provided phone model, NFT collection, and NFT ID.

## Contributing

Contributions are welcome! If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License

## Contact

Your Name - [@0xbanana](https://twitter.com/0xbanana)

Project Link: [https://github.com/echohtp/wallpaper-generator](https://github.com/echohtp/wallpaper-generator)

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Choose an Open Source License](https://choosealicense.com)
