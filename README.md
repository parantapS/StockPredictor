# StockReporter

A Node.js web application for fetching and displaying stock data using the Polygon.io API(now called Massive).

## Features

- Fetch historical stock data for multiple tickers
- Cache stock data to reduce API calls
- Display stock information in a web interface
- Support for date range queries

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your Polygon.io API key:
   ```
   POLYGON_API_KEY=your_api_key_here
   ```

## Usage

Start the server:
```
npm run startServer
```

Open your browser and navigate to `http://localhost:3000` (or the configured port).

## Project Structure

- `server.js`: Main server file
- `services/fetchStockData.js`: Handles API calls to Polygon.io
- `services/processData.js`: Processes stock data by calling openai to summarize
- `cache/stockCache.js`: Caching logic
- `utils/dates.js`: Date utility functions
- `views/index.ejs`: EJS template for the web interface
- `public/`: Static assets (CSS and JS)

## Dependencies

- express
- ejs
- dotenv
- node-fetch (or similar for API calls but not needed for the node version for this project.)

## API

The application uses the Polygon.io Aggregates API to fetch daily stock data. Also uses OpenAI api API to generate a summary using the data returned from polygon.io

## OpenAI Integration for Stock Summaries

To generate AI-powered summaries of stock data:

1. Install the OpenAI SDK:
   ```
   npm install openai
   ```

2. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_key_here
   ```

3. Create a new service file `services/processData.js`. Import and use this file which calls the openAI api in your application logic (e.g., in `server.js` ) to generate summaries

## Future Enhancements
 
- Add a UI spinner component when making OpenAI API calls to indicate loading.
- Adding caching fails the first call for that ticker to openAI. It works for the cached calls after. Removing cache logic makes this work or we need to add retry logic to this.
- Stress testing needs to be added for the app.
- Since the app is using OpenAI, make sure to go through best safety practices like advesarial testing, HITL, Moderation API etc. Link provided  -https://platform.openai.com/docs/guides/safety-best-practices