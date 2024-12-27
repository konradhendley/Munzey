import React from "react";
import { Link } from "react-router-dom"; // If using React Router for navigation

const Header = () => {
  return (
    <header>
      <h1>Expense Tracker</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/expenses">Expenses</Link>
          </li>
          <li>
            <Link to="/add-expense">Add Expense</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;