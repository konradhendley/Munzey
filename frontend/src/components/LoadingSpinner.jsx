import React from 'react';
import Header from './Header';
import Footer from './Footer';

const LoadingSpinner = ({ standalone = true}) => {
  return (
    <div className={standalone ? 'wrapper' : ''}>
        {standalone && <Header />} 
          <div className={standalone ? 'content-container' : ''}>

            <div>
            <div className="spinner"></div>
            <p>Loading...</p>
            </div>  
        </div>
      {standalone && <Footer/>}
    </div>
  );
};

export default LoadingSpinner;