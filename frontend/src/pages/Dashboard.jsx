import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ExpenseList from '../components/ExpenseList';
import Chart from '../components/Chart';

const Dashboard = () => {

  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';
  //const username = location.state?.username || 'Guest';

  console.log("User Info:", location);
  console.log("local storage:", localStorage);

  return (
    <div className="dashboard-container">
      <Header/>
      <h1>Welcome to Your Dashboard {username}!</h1>
      <p>Track and visualize your expenses in one place.</p>
      <div className="dashboard-actions">
        <a href="/createExpense">Create Expenses</a>
        <a href="/expenses">See All Expenses</a>
        <ExpenseList showHeader={false}/>
        <a href="/chart">View Chart</a>
        <Chart showHeader={false}/>
      </div>
    </div>
  );
};

export default Dashboard;