import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from './LoadingSpinner';
import { fetchExpenses } from '../utils/fetchExpenses';

const Calendar = () => {
  const location = useLocation();
  const [expenses, setExpenses] = useState(() => {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    return storedExpenses;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const isStandalone = location.pathname === '/calendar';

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelectedDate(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (info) => {
    const formattedDate = new Date(info.dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    setSelectedDate(formattedDate);
  };

  const eventColors = {
    /*Food: 'red',
    Travel: 'blue',
    Utilities: 'green',
    Shopping: 'purple',*/
  };

  const events = expenses.map((expense) => ({
    title: expense.category,
    start: expense.date,
    backgroundColor: eventColors[expense.category] || 'gray',
    borderColor: eventColors[expense.category] || 'gray',
  }));

  return (
    <div className={isStandalone ? 'wrapper' : ''}>
      <div className={isStandalone ? 'content-container' : ''}>
        {isStandalone && <Header />}
        {loading ? (
          <div className="loading-container">
            <LoadingSpinner standalone={false} /> 
          </div>
        ) : expenses.length === 0 ? (
          <p className="empty-message">
            No expenses found. <Link to="/createExpense">Create an expense</Link>
          </p>
        ) : (
          <div className="generic-container" ref={containerRef}>
            {isStandalone && (
              <div className="back-button-container">
                <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
              </div>
            )}
            {error ? (
              <p className="error">{error}</p>
            ) : (
              <FullCalendar
                key={expenses.length} 
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
              /> 
            )}
            </div>
        )}
            {isStandalone && selectedDate && (
              
              <div className="details-container">
                <h2>Expenses on {selectedDate}</h2>
                <ul>
                  {expenses
                    .filter((expense) => new Date(expense.date).toLocaleDateString('en-US') === new Date(selectedDate).toLocaleDateString('en-US'))
                    .map((expense, index) => (
                      <li key={index}>{expense.category}: ${expense.amount}</li>
                    ))}
                </ul>
              </div>
            )}   
        {isStandalone && <Footer />}
      </div>
    </div>
  );
};

export default Calendar;
