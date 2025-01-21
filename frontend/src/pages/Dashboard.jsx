import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExpenseList from '../components/ExpenseList';
import Chart from '../components/Chart';

const Dashboard = () => {


  const username = localStorage.getItem('username') || 'Guest';

  return (
    <div className='wrapper'>    
      <div className='content-container'>
      <Header/>
        <div className="dashboard-container">
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
        <Footer/>
      </div>
      
    </div>
  );
};

export default Dashboard;