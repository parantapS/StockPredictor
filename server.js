import express from "express";
import path from "path";
import { dates } from "./utils/dates.js";
import { fetchStockData } from "./services/fetchStockData.js";
import { processStockData } from "./services/processData.js";

// create express app
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(process.cwd(), "public")));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// GET - Render main page.
app.get("/", (req, res) => {
  const ticks = req.body;
  res.render("index", { latestTickers: "", reportOutput: "" });
});

// POST - Handle form submission and generate report
app.post("/generate", async (req, res) => {
  try {
    const tickersString = req.body.tickers; // "AAPL,TSLA,MSFT"
    const tickersArr = tickersString.split(",").map(t => t.trim());
    console.log("Fetching data for:", tickersArr);

    const stockData = await fetchStockData(tickersArr, dates);
    console.log("API RESPONSE:", stockData);

    // 🔹 Do further processing here
    // we will get open AI to proccess this data
    let report;
    try {
      report = await processStockData(stockData);
    } catch (openaiErr) {
      console.log("OpenAI failed:", openaiErr);
      report = "Report generation failed. Please try again.";
    }

    console.log("Generated Report:", report);

    res.render("index", {
      latestTickers: tickersArr.join(", "),
      reportOutput: report
    });

  } catch (err) {
    console.error("POST/generate failed:", err);
    res.render("index", {
      latestTickers: "",
      reportOutput: "There was an error generating your report."
    });
  }
  
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  