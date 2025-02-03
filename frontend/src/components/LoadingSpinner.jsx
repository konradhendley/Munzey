import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LoadingSpinner = ({ standalone = true}) => {
  return (
    <div className={standalone ? 'wrapper' : ''}>
      <div className={standalone ? 'content-container' : ''}>
       {standalone && <Header />} 
            <div>
            <div className="spinner"></div>
            <p>Loading...</p>
            </div> 
            {standalone && <Footer/>} 
        </div>
    </div>
  );
};

export default LoadingSpinner;