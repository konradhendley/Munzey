import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
  });

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
        window.location.href = '/'; // Redirect to home or login page
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
    return <LoadingSpinner/>;
  }

  const { email_verified, phone_number_verified } = userData.attributes;

  return (
    <div className='wrapper'>
      <div className='content-container'>
        <Header />
        <div>
          <h2>Account Details</h2>
          {!isEditing ? (
            // View Mode
            <div>
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p>
                <strong>Email Verified:</strong>{' '}
                <input type="checkbox" checked={email_verified} disabled />
              </p>
              <p><strong>Phone Number:</strong> {formData.phone_number}</p>  
              <p>
                <strong>Phone Number Verified:</strong>{' '}
                <input type="checkbox" checked={phone_number_verified} disabled />
              </p>
            </div>
          ) : (
            // Edit Mode
            <form>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </form>
          )}
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
              <button onClick={handleDeleteAccount} style={{ color: 'red' }}>
                Delete Account
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Account;