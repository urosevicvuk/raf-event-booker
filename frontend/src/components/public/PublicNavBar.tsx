import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type {Category} from '../../types';
import CategoryService from '../../services/categoryService';
import './PublicNavBar.css';

const PublicNavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="public-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <h2 className={"navbar-brand"}>RAF Event Booker</h2>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          
          <Link to="/most-visited" className={location.pathname === '/most-visited' ? 'active' : ''}>
            Most Visited
          </Link>
          
          <div className="categories-dropdown">
            <button 
              className="categories-btn"
              onClick={() => setShowCategories(!showCategories)}
            >
              Categories ▾
            </button>
            {showCategories && (
              <div className="categories-menu">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    onClick={() => setShowCategories(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/ems" className="ems-link">⚙️
              </Link>
              <button onClick={handleLogout} className="logout-btn-public">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-link">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavBar;