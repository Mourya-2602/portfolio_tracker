const express = require("express");
const router = express.Router();
const yahooFinance = require("yahoo-finance2").default; // Yahoo Finance Library
const Stock = require("../models/Stock");

// Fetch stock price from Yahoo Finance
router.get('/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const stockData = await yahooFinance.quote(symbol); // Fetch stock data
    if (!stockData || !stockData.regularMarketPrice) {
      throw new Error("Invalid stock symbol or data unavailable");
    }
    
    const price = stockData.regularMarketPrice; // Extract price
    res.status(200).json({
      symbol: stockData.symbol,
      price,
      name: stockData.longName || stockData.shortName,
      currency: stockData.currency,
      changePercent: stockData.regularMarketChangePercent,
    });
  } catch (error) {
    console.error("Error fetching stock data:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create a stock
router.post("/", async (req, res) => {
  try {
    const { name, ticker, quantity, buyPrice, purchasedDate } = req.body;
    const stock = new Stock({ name, ticker, quantity, buyPrice, purchasedDate });
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    res.status(400).json({ message: "Error creating stock", error: err.message });
  }
});

// Get all stocks
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (err) {
    res.status(400).json({ message: "Error fetching stocks", error: err.message });
  }
});

// Edit stock details
router.put("/:id", async (req, res) => {
  try {
    const { name, ticker, quantity, buyPrice, purchasedDate } = req.body;
    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      { name, ticker, quantity, buyPrice, purchasedDate },
      { new: true }
    );
    res.status(200).json(stock);
  } catch (err) {
    res.status(400).json({ message: "Error updating stock", error: err.message });
  }
});

// Delete a stock
router.delete("/:id", async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Stock deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting stock", error: err.message });
  }
});

module.exports = router;
