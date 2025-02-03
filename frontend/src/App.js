import './App.css';
import React, {useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import { initializeAuthListeners, checkSession } from "./utils/authUtils";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/VerifyUser';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import ExpenseEdit from './components/ExpenseEdit';
import Chart from './components/Chart';
import Account from './pages/Account';
import About from './pages/AboutPage';
import Contact from './pages/ContactPage';
import Calendar from './components/Calendar';


function App() {

  useEffect(() => {
    initializeAuthListeners();
    checkSession();
}, []);

  return (
    <div className="App">
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/createExpense" element={<ExpenseForm />} />
          <Route path="/editExpense/:expenseId" element={<ExpenseEdit />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      
    </div>
  );
}

export default App;