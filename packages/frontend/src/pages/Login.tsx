import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        // Update auth context
        login(data.user);
        // Redirect to home page
        navigate('/');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleError = () => {
    console.error('Login failed');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Welcome to BOBHack</h1>
          <p className="login-subtitle">Sign in to continue</p>
          
          <div className="login-google">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              theme="filled_blue"
              size="large"
              text="signin_with"
              shape="rectangular"
            />
          </div>
          
          <p className="login-info">
            Sign in with your Google account to access the platform
          </p>
        </div>
      </div>
    </div>
  );
};

