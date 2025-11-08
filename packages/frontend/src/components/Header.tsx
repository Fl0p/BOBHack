import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export const Header = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        {loading ? (
          <div className="user-info">Loading...</div>
        ) : user ? (
          <div className="user-section">
            <div className="user-info">
              {user.picture && (
                <img src={user.picture} alt={user.name} className="user-avatar" />
              )}
              <span className="user-email">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="join-button">
            Join
          </Link>
        )}
        <div className="header-logo">
          <Link to="/">BOBHack</Link>
        </div>
      </div>
    </header>
  );
};

