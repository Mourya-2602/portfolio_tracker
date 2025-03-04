import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [prices, setPrices] = useState({});
  const [initialInvestment, setInitialInvestment] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/stocks')
      .then(response => {
        setStocks(response.data);
        response.data.forEach(stock => {
          if (stock.ticker) {
            axios.get(`http://localhost:5000/api/stock/${stock.ticker}`)
              .then(priceResponse => {
                const price = priceResponse.data.price;
                setPrices(prevPrices => ({
                  ...prevPrices,
                  [stock._id]: price,
                }));
              });
          }
        });
      })
      .catch(error => {
        console.error('There was an error fetching the stocks!', error);
      });
  }, []);

  const totalPortfolioValue = stocks.reduce((total, stock) => {
    const stockPrice = prices[stock._id] || 0;
    return total + (stock.quantity * stockPrice);
  }, 0);

  const totalCost = stocks.reduce((total, stock) => total + (stock.buyPrice * stock.quantity), 0);

  const totalProfitLoss = totalPortfolioValue - totalCost;

  const portfolioGrowth = ((totalPortfolioValue - initialInvestment) / initialInvestment) * 100;

  // Portfolio distribution pie chart data
  const chartData = {
    labels: stocks.map(stock => stock.name),
    datasets: [{
      data: stocks.map(stock => {
        const stockPrice = prices[stock._id] || 0;
        return stock.quantity * stockPrice;
      }),
      backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#33FFF7'],
    }]
  };

  // Highest Gain and Loss calculation
  const calculateProfitLoss = (stock) => {
    const currentPrice = prices[stock._id] || 0;
    const totalCost = stock.buyPrice * stock.quantity;
    return (currentPrice - stock.buyPrice) * stock.quantity; // Profit or Loss for this stock
  };

  const highestGainStock = stocks.reduce((max, stock) => {
    const gain = calculateProfitLoss(stock);
    return gain > max ? gain : max;
  }, 0);

  const highestLossStock = stocks.reduce((min, stock) => {
    const loss = calculateProfitLoss(stock);
    return loss < min ? loss : min;
  }, 0);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <h3>Stock List</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Stock Name</th>
                <th>Ticker</th>
                <th>Quantity</th>
                <th>Buy Price</th>
                <th>Current Price</th>
                <th>Total Cost</th>
                <th>Total Equity</th>
                <th>Profit/Loss</th>
                <th>Purchased Date</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const totalCost = stock.quantity * stock.buyPrice;
                const totalEquity = prices[stock._id] ? stock.quantity * prices[stock._id] : 0;
                const profitLoss = totalEquity - totalCost;

                return (
                  <tr key={stock._id}>
                    <td>{stock.name}</td>
                    <td style={{ color: 'orange'}}>{stock.ticker}</td>
                    <td>{stock.quantity}</td>
                    <td>${stock.buyPrice}</td>
                    <td className="current-price" style={{ color: 'blue'}}>${prices[stock._id] || 'Loading...'} </td>
                    <td>${totalCost.toFixed(2)}</td>
                    <td>${totalEquity.toFixed(2)}</td>
                    <td style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>
                      ${profitLoss.toFixed(2)}
                    </td>
                    <td>{new Date(stock.purchasedDate).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <h3>Total Portfolio Value</h3>
          <p><strong>${totalPortfolioValue.toFixed(2)}</strong></p>

          <h3>Total Profit/Loss</h3>
          <p style={{ color: totalProfitLoss >= 0 ? 'green' : 'red' }}>
            <strong>${totalProfitLoss.toFixed(2)}</strong>
          </p>

          <h3>Top Performing Stock</h3>
          <p style={{ color: highestGainStock >= 0 ? 'green' : 'red' }}>
            <strong>Positive Gains: ${highestGainStock.toFixed(2)}</strong>
          </p>

          <h3>Worst Performing Stock</h3>
          <p style={{ color: highestLossStock <= 0 ? 'red' : 'green' }}>
            <strong>Negative Losses: ${highestLossStock.toFixed(2)}</strong>
          </p>
        </div>

        <div className="col-md-3">
          <h3>Portfolio Distribution</h3>
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
