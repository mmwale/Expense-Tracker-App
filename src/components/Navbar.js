/*
  Navbar
  - Main navigation component for the app. Shows links to pages and a pending approvals badge.
*/
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Navbar.css';



const Navbar = () => {
  const { pendingApprovals = [] } = useAppContext();
  const location = useLocation();
  
  // Helper to determine active link
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand">
        <img 
      src="/logo512.png"
      alt="Expense Tracker Logo"
      className="logo-img"
        />
        <span className="logo-text">ExpenseFlow</span>
        </Link>
      </div>
      
      <nav className="navbar-nav">
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          <i className="fas fa-home nav-icon"></i>
          <span className="nav-text">Dashboard</span>
        </Link>
        
        <Link to="/expenses" className={`nav-link ${isActive('/expenses')}`}>
          <i className="fas fa-receipt nav-icon"></i>
          <span className="nav-text">Expenses</span>
        </Link>
        
        <Link to="/trips" className={`nav-link ${isActive('/trips')}`}>
          <i className="fas fa-plane nav-icon"></i>
          <span className="nav-text">Trips</span>
        </Link>
        
        <Link to="/approvals" className={`nav-link ${isActive('/approvals')}`}>
          <i className="fas fa-check-circle nav-icon"></i>
          <span className="nav-text">Approvals</span>
          {pendingApprovals.length > 0 && (
          <span className="notification-badge">
          {Math.min(pendingApprovals.length, 99)}
        </span>
          )}
        </Link>
      </nav>
      
      <div className="navbar-footer">
        <div className="profile-section">
          <img 
            src="/profilepic.jpg" 
            alt="Profile" 
            className="profile-img"
          />
          <div className="profile-info">
            <span className="profile-name">Medani Mwale</span>
            <span className="profile-role">Web Developer</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;