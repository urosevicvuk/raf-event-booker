import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../auth';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Mock user data - in real app, decode from JWT or fetch from API
    setUser({
      name: 'Admin User',
      type: 'admin',
      email: 'admin@raf.rs'
    });
  }, [navigate]);

  const handleLogout = () => {
    logout(navigate);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* EMS Navigation */}
      <nav style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2>Event Management System</h2>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <span>Dobrodošli, {user.name}</span>
          <button 
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>EMS Dashboard</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <Link 
            to="/ems/categories" 
            style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#2c3e50',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <h3>📂 Kategorije</h3>
            <p>Upravljanje kategorijama događaja</p>
          </Link>

          <Link 
            to="/ems/events" 
            style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#2c3e50',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <h3>🎉 Događaji</h3>
            <p>Kreiranje i upravljanje događajima</p>
          </Link>

          <Link 
            to="/ems/search" 
            style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              textDecoration: 'none',
              color: '#2c3e50',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <h3>🔍 Pretraga</h3>
            <p>Pretraga događaja po sadržaju</p>
          </Link>

          {user.type === 'admin' && (
            <Link 
              to="/ems/users" 
              style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '8px', 
                textDecoration: 'none',
                color: '#2c3e50',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}
            >
              <h3>👥 Korisnici</h3>
              <p>Upravljanje korisnicima (samo admin)</p>
            </Link>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link 
            to="/" 
            style={{
              color: '#3498db',
              textDecoration: 'none',
              padding: '1rem 2rem',
              border: '2px solid #3498db',
              borderRadius: '4px',
              display: 'inline-block'
            }}
          >
            ← Nazad na javnu platformu
          </Link>
        </div>
      </div>
    </div>
  );
};