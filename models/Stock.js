const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a stock name"],
    },
    ticker: {
        type: String,
        required: [true, "Please add a stock ticker"],
    },
    quantity: {
        type: Number,
        required: [true, "Please add the quantity"],
    },
    buyPrice: {
        type: Number,
        required: [true, "Please add the buy price"],
    },
    purchasedDate: {
        type: Date,
        required: [true, "Please add the purchase date"],
    },
});

module.exports = mongoose.model("Stock", stockSchema);
