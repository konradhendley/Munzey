//expese.jsx file
import React, { useState } from 'react';

const ExpenseForm = () => {
  const [expense, setExpense] = useState("");

  const handleChange = (e) => {
    setExpense(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <div className="expense-form">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={expense}
          onChange={handleChange}
          placeholder="Enter expense"
          required
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;