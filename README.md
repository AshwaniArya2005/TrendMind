# TrendMind - AI Model Discovery Platform

TrendMind is a modern web application for discovering, comparing, and learning about the latest AI models. This platform provides a user-friendly interface to browse AI models across different categories and access detailed information about each model.

![TrendMind Screenshot](/screenshots/homepage.png)

## Features

- **Discover AI Models**: Browse through a comprehensive collection of AI models
- **Detailed Model Information**: Access specifications, performance metrics, and usage examples
- **Compare Models**: Side-by-side comparison of different AI models
- **Filtering & Sorting**: Find models by category, popularity, or specific criteria
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React, Material UI
- **Routing**: React Router
- **Styling**: Emotion (CSS-in-JS)

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/trendmind.git
   cd trendmind
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
trendmind/
├── public/               # Public assets
├── src/                  # Source files
│   ├── assets/           # Images and other static files
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── App.js            # Main App component
│   └── index.js          # Application entry point
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## Customization

### Adding New Models

To add new models to the application, update the mock data in the corresponding page components. In a production environment, you would typically fetch this data from an API.

### Styling

The application uses Material UI's theming system. You can customize the theme in `App.js`.

## Deployment

To build the application for production:

```
npm run build
```

This creates an optimized production build in the `build` folder that can be deployed to any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern SaaS and discovery platforms
- Icons from Material Icons
- Font from Google Fonts (Roboto and Playfair Display) 