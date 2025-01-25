import React, { useState } from 'react';
import axios from 'axios';

function StockForm() {
  const [stock, setStock] = useState({
    name: '',
    ticker: '',
    quantity: 1,
    buyPrice: 0,
    purchasedDate: '', // Added purchasedDate field
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setStock({
      ...stock,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on input change
  };

  const validate = () => {
    const newErrors = {};
    if (!stock.name) newErrors.name = 'Stock Name is required';
    if (!stock.ticker) newErrors.ticker = 'Ticker is required';
    if (!stock.purchasedDate) newErrors.purchasedDate = 'Purchase Date is required'; // Validation for date
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    axios.post('http://localhost:5000/api/stocks', stock) // Replace with actual API endpoint
      .then(response => {
        console.log('Stock added successfully!', response.data);
        // Reset the form fields
        setStock({
          name: '',
          ticker: '',
          quantity: 1,
          buyPrice: 0,
          purchasedDate: '',
        });
        setErrors({}); // Clear errors on successful submission
      })
      .catch(error => {
        console.error('There was an error adding the stock!', error);
      });
  };

  return (
    <div className="container mt-4">
      <h1>Add Stock</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Stock Name</label>
          <input
            type="text"
            name="name"
            value={stock.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder={errors.name ? errors.name : ''}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ticker</label>
          <input
            type="text"
            name="ticker"
            value={stock.ticker}
            onChange={handleChange}
            className={`form-control ${errors.ticker ? 'is-invalid' : ''}`}
            placeholder={errors.ticker ? errors.ticker : ''}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={stock.quantity}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Buy Price</label>
          <input
            type="number"
            name="buyPrice"
            value={stock.buyPrice}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Purchase Date</label>
          <input
            type="date" // Added date input type
            name="purchasedDate"
            value={stock.purchasedDate}
            onChange={handleChange}
            className={`form-control ${errors.purchasedDate ? 'is-invalid' : ''}`}
            placeholder={errors.purchasedDate ? errors.purchasedDate : 'YYYY-MM-DD'}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Stock</button>
      </form>
    </div>
  );
}

export default StockForm;
