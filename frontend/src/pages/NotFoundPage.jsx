// src/pages/NotFoundPage.jsx
import React from 'react';
import Header from '../components/Header';

const NotFoundPage = () => {
  return (
    <div>
      <Header/>
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for does not exist.</p>
    </div>
  );
};

export default NotFoundPage;