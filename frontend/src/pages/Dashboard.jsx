import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {

  const location = useLocation();
  const username = location.state?.username || 'Guest';

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard {username}!</h1>
      <p>Track and visualize your expenses in one place.</p>
      <div className="dashboard-actions">
        <a href="/expenses">View Expenses</a>
        <a href="/chart">View Chart</a>
      </div>
    </div>
  );
};

export default Dashboard;