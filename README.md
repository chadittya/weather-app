# Weather App

A modern, responsive weather application built with React, TypeScript, and Vite. This app provides real-time weather information for any city worldwide, with a sleek user interface and intuitive user experience.

## Features

- **Real-time Weather Data**: Fetches current weather information from OpenWeatherMap API.
- **Geolocation Support**: Automatically detects user's location for instant local weather.
- **Search Functionality**: Allows users to search for weather in any city.
- **Autocomplete Suggestions**: Provides city suggestions as you type for easier searching.
- **Responsive Design**: Looks great on both desktop and mobile devices.
- **Error Handling**: Gracefully handles API errors and displays user-friendly messages.

## Tech Stack

- React
- TypeScript
- Vite
- CSS Modules

## Project Structure

```
src/
├── assets/
│ └── (weather icons)
├── components/
│ ├── Weather.tsx
│ └── weather.css
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## Key Components

### Weather Component

The main component of the application, responsible for:

- Fetching and displaying weather data
- Handling user input and search functionality
- Managing state for weather data, loading, and errors

[Weather Component](src/components/Weather.tsx)

```
startLine: 25
endLine: 246
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   VITE_APP_ID=your_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Building for Production

To create a production build, run:

```
npm run build
```

This will generate optimized assets in the `dist` directory.
