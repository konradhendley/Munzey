import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="left-nav">
        <h1><a href="/">Folio</a></h1>
        {token && (
          <nav className="main-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/chart">Charts</Link>
          </nav>
        )}
      </div>
      {token && (
        <div className="dropdown-container">
          <button
            className="dropdown-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            ☰
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/account">My Account</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;