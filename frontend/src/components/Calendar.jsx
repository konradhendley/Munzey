import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [loading, setLoading] = useState(expenses.length === 0);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const isStandalone = location.pathname === '/calendar';

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

  if (loading) {
    return <LoadingSpinner standalone={isStandalone} />;
  }

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const eventColors = {
    Food: 'red',
    Travel: 'blue',
    Utilities: 'green',
    Shopping: 'purple',
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
        <div className='generic-container'>
        {isStandalone && (
          <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        </div>
        )}
          {error ? (
            <p className='error'>{error}</p>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              events={events}
              dateClick={handleDateClick}
            />
          )}
          {selectedDate && (
            <div className='details-container'>
              <h2>Expenses on {selectedDate}</h2>
              <ul>
                {expenses
                  .filter((expense) => expense.date === selectedDate)
                  .map((expense, index) => (
                    <li key={index}>{expense.category}: ${expense.amount}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        {isStandalone && <Footer />}
      </div>
    </div>
  );
};

export default Calendar;
