import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
  });


  const isStandalone = location.pathname === '/account';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/user', {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        setUserData(data);
        setFormData({
          name: data.attributes['name'] || '',
          email: data.attributes['email'] || '',
          phone_number: data.attributes['phone_number'] || '',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to fetch user details.');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setUserData((prevUserData) => ({
        ...prevUserData,
        attributes: {
          ...prevUserData.attributes,
          ...formData,
        },
      }));
      setIsEditing(false); 
    } catch (err) {
      console.error('Error saving user data:', err);
      setError(err.message || 'Failed to save user details.', formData);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        const response = await fetch(
          'https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/user',
          {
            method: 'delete',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to delete account.');
        }

        alert('Account deleted successfully!');
        localStorage.clear();
        window.location.href = '/';
      } catch (err) {
        console.error('Error deleting account:', err);
        setError(err.message || 'Failed to delete account.');
      }
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!userData) {
    return <LoadingSpinner standalone={isStandalone}/>;
  }

  const { email_verified, phone_number_verified } = userData.attributes;

  return (
    <div className='wrapper'>
      <div className='content-container'>
        <Header />
          <div className='form-container'>
            <form className='generic-form'>
              <h2>Account Details</h2>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="checkbox-container">
                <label>Email Verified:</label>
                <input type="checkbox" checked={email_verified} disabled />
              </div>
              <div>
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="checkbox-container">
                <label>Phone Verified:</label>
                <input type="checkbox" checked={phone_number_verified} disabled />
              </div>
         
  
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
              <Link onClick={handleDeleteAccount} style={{ color: 'red' }}>Delete Account</Link>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
             </form>
          </div>
        <Footer />
      </div>
    </div>
  );
};

export default Account;