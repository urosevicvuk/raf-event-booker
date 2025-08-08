import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PublicNavBar.css';

interface Category {
  id: number;
  name: string;
}

// Mock data for now - this will come from API later
const mockCategories: Category[] = [
  { id: 1, name: 'Koncerti' },
  { id: 2, name: 'Konferencije' },
  { id: 3, name: 'Radionice' },
  { id: 4, name: 'Sport' },
  { id: 5, name: 'Kultura' }
];

export const PublicNavBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="public-navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" className="logo-link">
            <h1>RAF Event Booker</h1>
          </Link>
        </div>

        <div className="nav-menu">
          <Link to="/" className="nav-link">Početna</Link>
          <Link to="/most-visited" className="nav-link">Najposećeniji</Link>
          
          <div className="categories-dropdown">
            <span className="nav-link">Kategorije</span>
            <div className="dropdown-content">
              {mockCategories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/category/${category.id}`}
                  className="dropdown-link"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pretraži događaje..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Pretraži
            </button>
          </form>
        </div>

        <div className="nav-auth">
          <Link to="/login" className="auth-link">
            Admin Prijava
          </Link>
        </div>
      </div>

      <div className="reactions-sidebar">
        <h3>Najviše reakcija</h3>
        <div className="top-reactions">
          {/* This will be populated by API call */}
          <div className="reaction-item">
            <Link to="/event/1">Koncert XYZ</Link>
            <span className="reaction-count">45 reakcija</span>
          </div>
          <div className="reaction-item">
            <Link to="/event/2">IT Konferencija</Link>
            <span className="reaction-count">32 reakcije</span>
          </div>
          <div className="reaction-item">
            <Link to="/event/3">Radionica fotografije</Link>
            <span className="reaction-count">28 reakcija</span>
          </div>
        </div>
      </div>
    </nav>
  );
};