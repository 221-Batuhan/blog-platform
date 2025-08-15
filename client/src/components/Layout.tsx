import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">📝</span>
            <span className="logo-text">Blogged</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            {user && (
              <>
                <Link to="/create" className="nav-link write-button">
                  ✏️ Write
                </Link>
                <div className="user-menu">
                  <img 
                    src={user.avatar || '/default-avatar.png'} 
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <button onClick={handleLogout} className="dropdown-item logout-button">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
            {!user && (
              <div className="auth-buttons">
                <Link to="/login" className="auth-button login-button">Login</Link>
                <Link to="/register" className="auth-button register-button">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Blogged</h3>
            <p>Share your thoughts with the world</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/create">Write</Link>
            {user && <Link to="/profile">Profile</Link>}
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">GitHub</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Blogged. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
