import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <a className="navbar-brand" href="/dashboard">Dashboard</a>
            <div className="navbar-nav">
              <a className="nav-link" href="/add-stock">Add Stock</a>
              <a className="nav-link" href="/stock-list"> Edit Stock </a>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-stock" element={<StockForm />} />
          <Route path="/stock-list" element={<StockList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
