import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/public/HomePage';
import { EventDetails } from './pages/public/EventDetails';
import { CategoryEvents } from './pages/public/CategoryEvents';
import { SearchResults } from './pages/public/SearchResults';
import { MostVisited } from './pages/public/MostVisited';
import { LoginPage } from './pages/auth/LoginPage';
import { Dashboard } from './pages/ems/Dashboard';
import { Categories } from './pages/ems/Categories';
import { Events } from './pages/ems/Events';
import { Users } from './pages/ems/Users';
import { EventSearch } from './pages/ems/EventSearch';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/category/:id" element={<CategoryEvents />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/most-visited" element={<MostVisited />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* EMS Routes (Protected) */}
          <Route path="/ems" element={<Dashboard />} />
          <Route path="/ems/categories" element={<Categories />} />
          <Route path="/ems/events" element={<Events />} />
          <Route path="/ems/users" element={<Users />} />
          <Route path="/ems/search" element={<EventSearch />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
