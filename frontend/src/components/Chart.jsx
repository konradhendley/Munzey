import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {
  const location = useLocation();
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await fetch('https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/expenses', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const data = await response.json();
        setExpenses(data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError(err.message);
      }
    };

    fetchExpenses();
  }, []);

  // Set default date range to the current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  // Apply filters whenever the filter state changes
  useEffect(() => {
    setLoading(true);

    const filtered = (expenses || []).filter((expense) => {
      const expenseDate = new Date(expense.date);
      const isWithinDateRange =
        (!startDate || expenseDate >= new Date(startDate)) &&
        (!endDate || expenseDate <= new Date(endDate));
      const matchesCategory = !category || expense.category === category;

      return isWithinDateRange && matchesCategory;
    });
    
    setFilteredExpenses(filtered);
    setLoading(false);
  }, [expenses, startDate, endDate, category]);
  
  // Prepare data for the chart
  const groupedExpenses = filteredExpenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + parseFloat(amount || 0); 
    return acc;
  }, {});

  const labels = Object.keys(groupedExpenses);
  const dataValues = Object.values(groupedExpenses);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Expenses by Category',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expense Tracker Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCategory('');
  };

  return (
    <div>
      {location.pathname === '/chart' && <Header />}
      <div className="chart-container">
      {error && <p className="error">{error}</p>}
        {/* Filter controls */}
        <div className="filter-controls">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <label>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All</option>
              {[...new Set((expenses || []).map((exp) => exp.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleClearFilters}>Clear Filters</button>
        </div>

        {loading ? (
          <p>Loading chart...</p>
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default Chart;