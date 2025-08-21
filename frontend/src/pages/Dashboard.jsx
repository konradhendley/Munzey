import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExpenseList from '../components/ExpenseList';
import Chart from '../components/Chart';
import Calendar from '../components/Calendar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchExpenses } from '../utils/fetchExpenses';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const username = localStorage.getItem('username') || 'Guest';
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await fetchExpenses();
      setExpenses(data);
    };
    loadExpenses();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
      setExpenses(storedExpenses);
      setLoading(false);
    }, 1500);
  }, []);

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
       <Header />    
      <div className='content-container'>
        <div className="dashboard-container">
          <h1 className="dashboard-header">{greeting}, {username}!</h1>
          <p className="dashboard-header">Track and visualize your finances in one place.</p>
          
          {loading ? (
            <div className="loading-container">
              <LoadingSpinner standalone={false}/> 
            </div>
          ) : expenses.length === 0 ? (
            <p className="empty-message">No expenses found. <Link to="/createExpense">Create an expense</Link></p>
          ) : (
            <div className="dashboard-grid">
              {/* Left - Chart */}
              <div className="dashboard-section">
                <h2>Chart</h2> <Link to="/chart">View Chart</Link>
                <div className="dashboard-wrapper">
                  <Chart showHeader={false} />
                </div>
              </div>

              {/* Middle - Expenses */}
              <div className="dashboard-section">
                <h2>Recent Expenses</h2> <Link to="/expenses">View Expenses</Link>
                <div className="dashboard-wrapper">
                  <ExpenseList showHeader={false} />
                </div> 
              </div>

              {/* Right - Calendar */}
              <div className="dashboard-section">
                <h2>Calendar</h2> <Link to="/calendar">View Calendar</Link>
                <div className="dashboard-wrapper">
                  <Calendar />
                </div>
              </div>
            </div>
          )}
        </div> 
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;