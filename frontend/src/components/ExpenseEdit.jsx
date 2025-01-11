import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';


const ExpenseEdit = () => {

  const location = useLocation();
  const { expenseId } = location.state || {}; 
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch the expense details for the given expenseId when the component loads
  useEffect(() => {
    const fetchExpense = async () => {
      const token = localStorage.getItem('accessToken');
    
      try {
        const response = await fetch(
          `https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/expense/${expenseId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch expense details');
        }

        const expense = await response.json();
        setDescription(expense.description);
        setAmount(expense.amount);
        setCategory(expense.category);
        setDate(expense.date);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchExpense();
  });

  const handleSubmit = async (e, redirect = false) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(
        `https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/expense/${expenseId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description,
            amount: parseFloat(amount),
            category,
            date,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      setSuccess(true);
      setError('');
      setSuccess('Expense updated successfully!');
      setTimeout(() => {
        window.history.back(); 
      }, 1000);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this expense?');
    if (!confirmed) return;

    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(
        `https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/expense/${expenseId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      setError('');
      setSuccess('Expense deleted successfully!');
      setTimeout(() => {
        window.history.back(); 
      }, 1000);
    } catch (err) {
      setError(err.message);
      setSuccess(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div>
      <Header />
      <div className="expense-form">
        {/* "X" Cancel Icon */}
        <button className="cancel-icon" onClick={handleCancel}>
          &times;
        </button>
        <h2>Edit Expense</h2>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expense description"
            required
          />
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Expense amount"
            required
          />
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Expense category"
            required
          />
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="button-group">
            <button type="submit">Update Expense</button>
            <button
              type="button"
              onClick={handleDelete}
              style={{ marginLeft: '10px' }}
            >
              Delete Expense
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseEdit;