import React, { useState } from 'react';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Verify = () => {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const client = new CognitoIdentityProviderClient({
    region: "us-east-1",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const params = {
        ClientId: "t8bgij0uga0qic6m1na4rgrua", 
        Username: username,
        ConfirmationCode: code,
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
    <div className="content-container">
        <Header/>
        <div className='form-container'>
        < div className="generic-form">
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
            <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            />
            <button type="submit">Verify</button>
        </form>
        </div>
        </div>
        <Footer/>
    </div>
  </div>
  );
};

export default Verify;
