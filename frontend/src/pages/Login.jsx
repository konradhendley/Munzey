import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import Header from '../components/Header';
import Footer from '../components/Footer';

const client = new CognitoIdentityProviderClient({ region: 'us-east-1' }); 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log('LS at logout:', localStorage);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: 't8bgij0uga0qic6m1na4rgrua', 
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response = await client.send(command);
      console.log('Login successful:', response);
     
       // Store tokens
       localStorage.setItem('accessToken', response.AuthenticationResult.AccessToken);
       localStorage.setItem('idToken', response.AuthenticationResult.IdToken);
       localStorage.setItem('refreshToken', response.AuthenticationResult.RefreshToken);
      //store username
       localStorage.setItem('username', username);
 
       // Redirect to the dashboard
       navigate('/dashboard', { state: { username: username } });


    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className='wrapper'>
        <div className='content-container'>
          <Header/>
          <h2>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
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
            <button type="submit">Login</button>
          </form>
          <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
        </div>
      <Footer/>
    </div>
  );
}

export default Login;