import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

const ExpenseList = ({ user, showHeader = true }) => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const navigate = useNavigate();
  const location = useLocation();

  const isStandalone = location.pathname === '/expenses';

  useEffect(() => {
    const fetchExpenses = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await fetch('https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/expenses', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch expenses.');
        }
        const data = await response.json();
        setExpenses(data);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError(err.message);
      }
    };

    fetchExpenses();
  }, [user]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedExpenses = [...expenses].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setExpenses(sortedExpenses);
  };

  const handleEdit = (expenseId) => {
    navigate(`/editExpense/${expenseId}`, { state: { expenseId } });
  };

  if (expenses.length === 0 && !error) {
    return <LoadingSpinner standalone={isStandalone} />;
  }

  return (
    <div className={isStandalone ? 'wrapper' : ''}>
    <div className={isStandalone ? 'content-container' : ''}>
      {isStandalone && <Header />}

      <div className="expense-list">
  {isStandalone && (
    <div className="back-button-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
    </div>
  )}
  
  <h2>Expenses</h2>

  {error ? (
    <p style={{ color: 'red' }}>{error}</p>
  ) : (
    <div className="expense-table-container">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('description')}>Description</th>
            <th onClick={() => handleSort('amount')}>Amount</th>
            <th onClick={() => handleSort('category')}>Category</th>
            <th onClick={() => handleSort('date')}>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.expenseId}>
              <td>{expense.description}</td>
              <td>${expense.amount}</td>
              <td>{expense.category}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(expense.expenseId)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
{isStandalone && (
    <div> 
      <Link to="/createExpense">+ Create Expense</Link>
    </div>
  )}
      {isStandalone && <Footer />}
    </div>
  </div>
  );
};

export default ExpenseList;