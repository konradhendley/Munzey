import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <p>Track and visualize your expenses in one place.</p>
      <div className="dashboard-actions">
        <a href="/expenses">View Expenses</a>
        <a href="/chart">View Chart</a>
      </div>
    </div>
  );
};

export default Dashboard;