import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { LoginRequest } from '../../types';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // const response = await login(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation for demo
      if (formData.email === 'admin@raf.rs' && formData.password === 'admin123') {
        // Store JWT token (mock)
        localStorage.setItem('jwt', 'mock-jwt-token');
        navigate('/ems');
      } else {
        setError('Neispravni podaci za prijavu. Pokušajte sa admin@raf.rs / admin123');
      }
    } catch (err) {
      setError('Greška pri prijavljivanju. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="back-link">← Nazad na početnu</Link>
          <h1>RAF Event Booker</h1>
          <h2>EMS Prijava</h2>
          <p>Prijavite se da biste pristupili Event Management sistemu</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email adresa</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="admin@raf.rs"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Lozinka</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Unesite lozinku"
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Prijavljivanje...' : 'Prijava'}
          </button>
        </form>

        <div className="login-info">
          <div className="demo-credentials">
            <h3>Demo podaci:</h3>
            <p><strong>Email:</strong> admin@raf.rs</p>
            <p><strong>Lozinka:</strong> admin123</p>
          </div>
          
          <div className="user-types">
            <h3>Tipovi korisnika:</h3>
            <ul>
              <li><strong>Event Creator:</strong> Kreira i uređuje događaje</li>
              <li><strong>Admin:</strong> Sve mogućnosti + upravljanje korisnicima</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};