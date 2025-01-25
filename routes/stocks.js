const express = require("express");
const router = express.Router();
const {
    getStocks,
    addStock,
    updateStock,
    deleteStock,
} = require("../controllers/stockController");

// Define routes
router.get("/", getStocks); // Fetch all stocks
router.post("/", addStock); // Add a new stock
router.put("/:id", updateStock); // Update stock by ID
router.delete("/:id", deleteStock); // Delete stock by ID

module.exports = router;
