import dotenv from "dotenv";
import { getCache, setCache } from '../cache/stockCache.js'
dotenv.config();

export async function fetchStockData(tickersArr, dates) {
  try {
    const stockData = await Promise.all(
      tickersArr.map(async (ticker) => {

        // create a cache key using ticker and date range
        const cacheKey = `${ticker}_${dates.startDate}_${dates.endDate}`;
        // console.log(`Cache key for ${ticker}:`, cacheKey);
        // 1️⃣ Check cache first
        const cached = getCache(cacheKey)
        if (cached) {
          // console.log(`Using cached data for ${ticker}`)
          return { ticker, data: cached }
        }

        console.log(`Fetching data for ${ticker} from API`);
        // 2️⃣ If not in cache, fetch from API
        const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API call failed for ${ticker}: ${response.status}`);
        }

        const apiData = await response.json(); // JSON is better than text

        // MOCK API DATA FOR TESTING
        // const apiData = {
        //   "data": {
        //     "ticker": "APPL",
        //     "queryCount": 1,
        //     "resultsCount": 0,
        //     "adjusted": true,
        //     "results": [
        //       {
        //         "v": 1234567,
        //         "vw": 123.4567,
        //         "o": 123.456,
        //         "c": 123.45,
        //         "h": 123.45,
        //         "l": 123.45,
        //         "t": 1234567800000,
        //         "n": 123456
        // }
        //     ],
        //     "status": "OK",
        //     "request_id": "003ce224d7628a8d8b1fe3abcdefghij"
        //   },
        //   "timestamp": 1766953288118
        // };
        // console.log(`Fetched API data for ${ticker}:`, apiData);

        // 2.5️⃣ Normalize data if needed
        const polygonData = apiData; // assuming apiData is in Polygon format
        const normalizedData = {
          ticker,
          results: polygonData.results,
          status: polygonData.status,
          count: polygonData.count,
          queryCount: polygonData.queryCount,
          resultsCount: polygonData.resultsCount,
          adjusted: polygonData.adjusted,
          request_id: polygonData.request_id
        };
        // console.log(`Normalized data for ${ticker}:`, normalizedData);
        // 3️⃣ Save to cache
        // console.log("💾 Saving to cache:", cacheKey);
        setCache(cacheKey, normalizedData)
        
        return { ticker, data: normalizedData };
      })
    );

    return stockData; // ✅ THIS IS CRITICAL
  } catch (err) {
        console.error("Error fetching stock data:", err);
        throw err; // rethrow so caller can handle it
  }
}
