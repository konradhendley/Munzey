import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import Header from '../components/Header';
import Footer from '../components/Footer';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
        Password: password,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "phone_number",
            Value: phoneNumber,
          },
          {
            Name: "name",
            Value: name,
          },
        ],
      };

      const command = new SignUpCommand(params);
      await client.send(command);

      setMessage("Signup successful! Please confirm your email before logging in.");
      setTimeout(() => navigate("/verify"), 3000);
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className='wrapper'>
    <div className="content-container">
      
      <Header />
      <h2>Sign Up</h2>
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Phone Number:</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
          required
        />
        <label>Password:</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label style={{ marginLeft: '8px' }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Log in</a>
      </p>
          <Footer/>
        </div>
    </div>
  );
};

export default Signup;