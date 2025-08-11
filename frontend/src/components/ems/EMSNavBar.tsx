import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './EMSNavBar.css';

const EMSNavBar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="ems-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/ems">
            <h2>RAF Event Booker - EMS</h2>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/ems/categories" 
            className={isActive('/ems/categories') ? 'active' : ''}
          >
            Categories
          </Link>
          
          <Link 
            to="/ems/events" 
            className={isActive('/ems/events') ? 'active' : ''}
          >
            Events
          </Link>
          
          <Link 
            to="/ems/search" 
            className={isActive('/ems/search') ? 'active' : ''}
          >
            Search Events
          </Link>

          {isAdmin && (
            <Link 
              to="/ems/users" 
              className={isActive('/ems/users') ? 'active' : ''}
            >
              Users
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-info">
            {user?.firstName} {user?.lastName}
            <span className="user-role">({user?.userType})</span>
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EMSNavBar;