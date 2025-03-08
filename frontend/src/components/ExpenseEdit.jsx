import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import categories from '../data/categories';


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

    if (!expenseId) return; 

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
  }, [expenseId]);

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
    <div className='wrapper'>
      <div className='content-container'>
      <Header />
      <div className='form-container'>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <form className="generic-form" onSubmit={handleSubmit}>
        <h2>Edit Expense</h2>
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
          <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="button-group">
            <button type="submit">Update </button>
            <button type="button" onClick={handleDelete}> Delete</button>
            <button type="button"onClick={handleCancel} > Cancel </button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  </div>
  );
};

export default ExpenseEdit;