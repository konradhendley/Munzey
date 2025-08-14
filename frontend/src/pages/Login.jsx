import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { config } from '../config';


const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: config.CLIENT_ID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response = await client.send(command);
      localStorage.setItem('accessToken', response.AuthenticationResult.AccessToken);
      localStorage.setItem('idToken', response.AuthenticationResult.IdToken);
      localStorage.setItem('refreshToken', response.AuthenticationResult.RefreshToken);
      localStorage.setItem('username', username);

      navigate('/dashboard', { state: { username: username } });
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className='wrapper'>
      <div className='content-container'>
        <Header />
        <div className='form-container'>
          <form className='generic-form' onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="checkbox-container">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label>Show Password</label>
          </div>
            <button type="submit">Login</button>
          </form>
          <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Login;
