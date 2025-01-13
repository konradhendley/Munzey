import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className='footer'>
      <p>&copy; 2025 Folio</p>
      
      <nav>
        <ul>
            <li>
                <Link to="/about">About</Link>
                </li>
                <li>
                <Link to="/contact">Contact Us</Link>
                </li>
        </ul>
    </nav>
    </footer>
  );
};

export default Footer;