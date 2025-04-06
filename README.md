# TrendMind

A Next.js application for discovering, comparing, and tracking trending AI models from Hugging Face.

## Features

- **Explore trending models**: View the latest and most popular models from Hugging Face
- **Model comparison**: Compare up to 3 models side-by-side with detailed metrics
- **Favorites**: Save your favorite models for quick access
- **Model details**: Comprehensive information about each model

## Tech Stack

- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Data Source**: Hugging Face API
- **State Management**: React Hooks
- **Storage**: Local Storage for favorites and comparison data

## Getting Started

### Prerequisites

- Node.js 14+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/trendmind.git
cd trendmind
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add:
```
HF_API_URL=https://huggingface.co/api
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and go to `http://localhost:3000`

## Project Structure

```
trendmind/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/            # Next.js pages
│   ├── services/         # API services
│   └── styles/           # Global styles
├── public/               # Static assets
├── .env                  # Environment variables
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── package.json          # Project dependencies
```

## Deployment

This project can be deployed on any platform that supports Next.js, such as Vercel or Netlify.

```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm run start
# or
yarn start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. 