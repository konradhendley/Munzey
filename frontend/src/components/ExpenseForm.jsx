import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from './Footer';
import categories from '../data/categories';

const ExpenseForm = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e, redirect = false) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken'); // Fetch the token from localStorage

    try {
      const response = await fetch('https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/expense', {
        method: 'POST',
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
      });

      if (!response.ok) {
        throw new Error('Failed to save expense');
      }

      setSuccess(true);
      setError('');
      if (redirect) {
        // Redirect back to the previous page
        window.history.back();
      } else {
        // Clear the form for the next expense
        setDescription('');
        setAmount('');
        setCategory('');
        setDate('');
      }
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
      <div className="form-container">
        {success && <p className="success">Expense saved successfully!</p>}
        {error && <p className="error">{error}</p>}
        <form className='generic-form'>
        <h2>Add New Expense</h2>
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
            min="0"
            step="0.01" 
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
            <button type="button" onClick={(e) => handleSubmit(e, true)}> Save and exit </button>
            <button type="button" onClick={(e) => handleSubmit(e, false)}>  Save and Add Another </button>
            <button type="button" onClick={handleCancel}> Cancel </button>
          </div>
        </form>
      </div>
      <Footer/>
      </div>
    </div>
  );
};

export default ExpenseForm;