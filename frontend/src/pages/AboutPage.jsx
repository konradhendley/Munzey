import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className='wrapper'>
      <div className='content-container'>
        <Header />
            <div>
            <p>Munzey is an expense tracking app created by <a href='https://www.linkedin.com/in/konradhendley/'>Konrad Hendley</a> in 2025. The name comes from the German word "munze" which means coin. The goal of this project is to help people be more aware of their finances and increase their financial literacy. 
                If you have any questions or would like to leave feedback, please feel free to <Link to="/contact">contact us</Link>! </p>
            </div>
                 
            <Footer/>
        </div>
    </div>
  );
};

export default About;