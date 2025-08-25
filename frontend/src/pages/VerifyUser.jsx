import React, { useState, useRef } from 'react';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { config } from '../config';

const Verify = () => {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const client = new CognitoIdentityProviderClient({
    region: config.REGION,
  });

  const handleCodeChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; 
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus(); 
    } else if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = {
        ClientId: config.CLIENT_ID, 
        Username: username, 
        ConfirmationCode: code.join(''),
      };

      const command = new ConfirmSignUpCommand(params);
      await client.send(command);

      setMessage("Your account has been verified successfully!");
      setTimeout(() => navigate("/login"), 3000); 
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    }
  };

  return (
    <div className='wrapper'>
      <Header />
      <div className="content-container">
      <div className="content">  
        <div className='form-container'>
          <div className="generic-form">
            <h2>Verify Your Email</h2>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label>Verification Code:</label>
              <div className="code-input-container">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="code-input"
                  />
                ))}
              </div>

              <button type="submit">Verify</button>
            </form>
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
};

export default Verify;