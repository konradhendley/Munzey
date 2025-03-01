import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import { fetchExpenses } from '../utils/fetchExpenses';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
      return storedExpenses;
    });
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const isStandalone = location.pathname === '/chart';

  useEffect(() => {
    if (expenses.length === 0) {
      const loadExpenses = async () => {
        setLoading(true);
        try {
          const data = await fetchExpenses();
          setExpenses(data);
        } catch (err) {
          console.error('Error loading expenses:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      loadExpenses();
    }
  }, [expenses]);


  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

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
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Expense Tracker Chart',
        color: 'white',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'white' },
      },
      x: {
        ticks: { color: 'white' },
      },
    },
    maintainAspectRatio: false,
    backgroundColor: 'black',
  };
    if (loading) {
      return <LoadingSpinner standalone={isStandalone} />;
    }
  /* removing this feature for now
  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setCategory('');
  };*/

  if (expenses.length === 0 && !error) {
    return <LoadingSpinner standalone={isStandalone} />;
  }

  return (
    <div className={location.pathname === '/chart' ? 'wrapper' : ''}>
      <div className={location.pathname === '/chart' ? 'content-container' : ''}>
        {location.pathname === '/chart' && <Header />}
        
        <div className="generic-container">
          {error && <p className="error">{error}</p>}

          {isStandalone && (
          <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        </div>
        )}
          <h2>Chart</h2>
          {/* Filter Controls */}
          {location.pathname === '/chart' && (
        <div className="filter-controls">
          <label>
            Start Date:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
          {/*<button onClick={handleClearFilters}>Clear Filters</button>*/}
        </div>
      )}

          {/* Chart Display */}
          <div className="chart-wrapper">

          { error ? (
            <p className='error'>{error}</p>
          ) : (
            <div className="bar-chart">
            <Bar data={data} options={options} />
            </div>
          )}
           
          </div>
        </div>

        {location.pathname === '/chart' && <Footer />}
      </div>
    </div>
  );
};

export default Chart;