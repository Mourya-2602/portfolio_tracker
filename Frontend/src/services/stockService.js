import axios from 'axios';

const API_URL = 'http://localhost:5000/api/'; // Replace with the actual backend URL

export const getAllStocks = () => {
  return axios.get(`${API_URL}stocks`);
};

export const addStock = (stock) => {
  return axios.post(`${API_URL}stocks`, stock);
};

export const deleteStock = (id) => {
  return axios.delete(`${API_URL}stocks/${id}`);
};

export const getPortfolioValue = () => {
  return axios.get(`${API_URL}portfolio/value`);
};
