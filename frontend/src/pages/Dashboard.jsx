import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExpenseList from '../components/ExpenseList';
import Chart from '../components/Chart';
import Calendar from '../components/Calendar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const username = localStorage.getItem('username') || 'Guest';
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <div className='wrapper'>    
      <div className='content-container'>
        <Header/>
        <div className="dashboard-container">
          <h1 className="dashboard-header">{greeting}, {username}!</h1>
          <p className="dashboard-header">Track and visualize your finances in one place.</p>
          
          <div className="dashboard-grid">
            {/* Left - Chart */}
            <div className="dashboard-section">
              <h2>Chart</h2>
              <Chart showHeader={false} />
              <Link to="/chart">View Chart</Link>
            </div>

            {/* Middle - Expenses */}
            <div className="dashboard-section">
              <h2>Recent Expenses</h2>
              <ExpenseList showHeader={false} />
              <Link to="/expenses">View Expenses</Link>
            </div>

            {/* Right - Calendar */}
            <div className="dashboard-section">
              <h2>Calendar</h2>
              <Calendar /> {/* Show recurring expenses & income */}
              <Link to="/calendar">View Calendar</Link>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </div>
  );
};

export default Dashboard;