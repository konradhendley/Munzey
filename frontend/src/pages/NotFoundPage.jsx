// src/pages/NotFoundPage.jsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFoundPage = () => {
  return (
    <div className='wrapper'>
      <div className='content-container'>
        <Header/>
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for does not exist.</p>
          <Footer/>
      </div>
    </div>
  );
};

export default NotFoundPage;