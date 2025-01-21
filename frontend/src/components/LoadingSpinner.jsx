import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LoadingSpinner = () => {
  return (
    <div className='wrapper'>
      <div className='content-container'>
        <Header />
            <div>
            <div className="spinner"></div>
            <p>Loading...</p>
            </div>
            <Footer/>
        </div>
    </div>
  );
};

export default LoadingSpinner;