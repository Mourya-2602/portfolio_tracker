# Portfolio Tracker Application

## Overview

This Portfolio Tracker application is a full-stack web application that allows users to manage and track their stock holdings. The application provides functionalities to add, view, edit, and delete stock holdings, along with tracking the total portfolio value based on real-time stock prices. A comprehensive dashboard is included to display key portfolio metrics such as total portfolio value, top-performing stock, and portfolio distribution.

---

## Features

### Frontend:
- **Responsive Design**: Built with React to ensure seamless use across devices.
- **Interactive Dashboard**: Displays key portfolio metrics:
  - Total portfolio value
  - Top-performing stock
  - Portfolio distribution via a pie chart
- **CRUD Operations**:
  - Add and edit stock details (name, ticker, quantity, buy price)
  - Delete stock holdings
  - View current stock holdings in a tabular format with real-time price updates


### Real-Time Data:
- Integrated with Yahoo Finance API for live stock prices.
- Calculates total portfolio value dynamically based on current stock prices.

### Database:
- **MongoDB Database**:
  - Schema designed to store stock details such as name, ticker, quantity, and buy price.
  - Relationships designed to support user and portfolio management.

---

## Steps to Run the Project Locally

### Prerequisites:
-  **Node.js and npm**: Install Node.js and npm for the frontend.

### Backend Setup:
1. Clone the repository:
   ```bash
   git clone Mourya-2602/portfolio_tracker.git
   ```
2. Configure MongoDB database:
   - Update `application.properties` in the `src/main/resources` folder with your database credentials.
3. Build and run the application:
   ```bash
   node server.js
   ```
4. Verify the backend is running at `http://localhost:5000`.

### Frontend Setup:
1. Navigate to the frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Access the application at `http://localhost:3000`.

---

## Assumptions and Limitations
- The portfolio is limited to 5 randomly selected stocks for assignment purposes.
- Each stock's quantity is assumed to be 1.
- Real-time data integration is based on the free tier of Alpha Vantage API, which has limitations on the number of requests per minute.



