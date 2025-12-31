import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { AppProvider } from './context/AppContext';
import ApprovalsPage from './pages/ApprovalsPage';
import DashboardPage from './pages/DashboardPage';
import ExpensePage from './pages/ExpensePage';
import HomePage from './pages/HomePage';
import TripPage from './pages/TripPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpensePage />} />
              <Route path="/trips" element={<TripPage />} />
              <Route path="/approvals" element={<ApprovalsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;