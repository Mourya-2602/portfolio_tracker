exports.getStocks = (req, res) => {
    res.status(200).json({ message: "Get all stocks" });
};

exports.addStock = (req, res) => {
    res.status(201).json({ message: "Add a stock" });
};

exports.updateStock = (req, res) => {
    res.status(200).json({ message: `Update stock ${req.params.id}` });
};

exports.deleteStock = (req, res) => {
    res.status(200).json({ message: `Delete stock ${req.params.id}` });
};
