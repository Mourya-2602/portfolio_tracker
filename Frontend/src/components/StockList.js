import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [editStock, setEditStock] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    ticker: '',
    quantity: '',
    buyPrice: '',
    purchasedDate: '', 
  });
  const [prices, setPrices] = useState({}); // To store the current prices of each stock

  useEffect(() => {
    // Fetch the list of stocks from your API
    axios.get('http://localhost:5000/api/stocks') // Replace with actual API endpoint
      .then(response => {
        setStocks(response.data);
        // Fetch the current price for each stock
        response.data.forEach(stock => {
          // Ensure the ticker is present and valid
          if (stock.ticker) {
            axios.get(`http://localhost:5000/api/stock/${stock.ticker}`) // Replace with the correct endpoint to get stock price
              .then(priceResponse => {
                const price = priceResponse.data.price; // Adjust according to the new Yahoo Finance API response
                if (price) {
                  setPrices(prevPrices => ({
                    ...prevPrices,
                    [stock._id]: price, // Store price by stock id
                  }));
                }
              })
              .catch(error => {
                console.error('Error fetching stock price:', error);
                setPrices(prevPrices => ({
                  ...prevPrices,
                  [stock._id]: 'Error fetching price', // Handle error gracefully
                }));
              });
          }
        });
      })
      .catch(error => {
        console.error('There was an error fetching the stocks!', error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/stocks/${id}`) // Replace with actual endpoint
      .then(() => {
        setStocks(stocks.filter(stock => stock._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the stock!', error);
      });
  };

  const handleEdit = (stock) => {
    setEditStock(stock._id);
    setEditFormData({
      name: stock.name,
      ticker: stock.ticker,
      quantity: stock.quantity,
      buyPrice: stock.buyPrice,
      purchasedDate: stock.purchasedDate || '', // Handle empty date
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/stocks/${editStock}`, editFormData) // Replace with actual endpoint
      .then(response => {
        setStocks(stocks.map(stock => 
          stock._id === editStock ? response.data : stock
        ));
        setEditStock(null);
      })
      .catch(error => {
        console.error('There was an error updating the stock!', error);
      });
  };

  // Function to format the date as DD/MM/YYYY for India with leading zeros
  const formatDate = (date) => {
    if (!date) return 'N/A'; // Handle empty date
    const formattedDate = new Date(date);
    
    const day = formattedDate.getDate().toString().padStart(2, '0'); // Pad single digit day
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // Pad single digit month
    const year = formattedDate.getFullYear();
    
    return `${day}/${month}/${year}`; // Return formatted date as DD/MM/YYYY
  };

  return (
    <div className="container mt-4" style={{ backgroundColor: '#f8f9fa' }}>
      <h1>Stock List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Ticker</th>
            <th>Quantity</th>
            <th>Buy Price</th>
            <th>Current Price</th> 
            <th>Total Cost</th> {/* Total Cost column */}
            <th>Total Equity</th> {/* New column for Total Equity */}
            <th>Profit/Loss</th> {/* New column for Profit/Loss */}
            <th>Purchased Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            // Calculate Total Cost (Quantity * Purchased Price)
            const totalCost = stock.quantity * stock.buyPrice;
            // Calculate Total Equity (Current Price * Quantity)
            const totalEquity = prices[stock._id] ? stock.quantity * prices[stock._id] : 0;
            // Calculate Profit/Loss (Total Equity - Total Cost)
            const profitOrLoss = totalEquity - totalCost;

            return (
              <tr key={stock._id}>
                <td>{stock.name}</td>
                <td style={{color:'orange'}}>{stock.ticker}</td>
                <td>{stock.quantity}</td>
                <td>${stock.buyPrice}</td>
                <td className="current-price" style={{color:'blue'}}>${prices[stock._id] || 'Loading...'}</td> {/* Apply the new class here */}
                <td>${totalCost.toFixed(2)}</td> 
                <td>${totalEquity.toFixed(2)}</td> {/* Display Total Equity */}
                <td style={{ color: profitOrLoss >= 0 ? 'green' : 'red' }}>
                  ${profitOrLoss.toFixed(2)} {/* Display Profit/Loss with color coding */}
                </td>
                <td>{formatDate(stock.purchasedDate)}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(stock)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(stock._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editStock && (
        <form onSubmit={handleEditSubmit} className="mt-4">
          <h3>Edit Stock</h3>
          <div className="mb-3">
            <label>Stock Name</label>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Ticker</label>
            <input
              type="text"
              name="ticker"
              value={editFormData.ticker}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={editFormData.quantity}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Buy Price</label>
            <input
              type="number"
              name="buyPrice"
              value={editFormData.buyPrice}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Purchased Date</label>
            <input
              type="date"
              name="purchasedDate"
              value={editFormData.purchasedDate}
              onChange={handleEditChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setEditStock(null)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default StockList;
