import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type {Category} from '../../types';
import CategoryService from '../../services/categoryService';
import './PublicNavBar.css';

const PublicNavBar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const location = useLocation();

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
      window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <nav className="public-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <h2>RAF Event Booker</h2>
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
          <Link to="/login" className="login-link">
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavBar;