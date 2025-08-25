import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://fb8a21npal.execute-api.us-east-1.amazonaws.com/dev/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className='wrapper'>
       <Header />
      <div className='content-container'>
        <div className="content"> 
          <div className='form-container'>
          <p className='generic-text'>
            Please fill out the form below with any questions or comments along with your contact information. 
            I will get back to you as soon as I can. Thank you!
          </p>
          {status && <p className={status.includes('success') ? 'success' : 'error'}>{status}</p>}
          <div className='generic-form'>
            <form onSubmit={handleSubmit}>
              <label>
                Name (optional)
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email (optional)
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                />
              </label>
              <label>
                Message
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  required
                />
              </label>
              <button type="submit" className="contact-custom-button">Send</button>
            </form>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;