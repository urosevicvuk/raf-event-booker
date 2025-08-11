import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/ems/DashboardPage';
import CategoriesPage from './pages/ems/CategoriesPage';
import EventsPage from './pages/ems/EventsPage';
import EventSearchPage from './pages/ems/EventSearchPage';
import UsersPage from './pages/ems/UsersPage';
import HomePage from './pages/public/HomePage';
import MostVisitedPage from './pages/public/MostVisitedPage';
import EventDetailPage from './pages/public/EventDetailPage';
import CategoryPage from './pages/public/CategoryPage';
import TagPage from './pages/public/TagPage';
import SearchPage from './pages/public/SearchPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/most-visited" element={<MostVisitedPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/tag/:id" element={<TagPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected EMS Routes */}
            <Route path="/ems" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/ems/categories" element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/ems/events" element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/ems/search" element={
              <ProtectedRoute>
                <EventSearchPage />
              </ProtectedRoute>
            } />
            
            <Route path="/ems/users" element={
              <ProtectedRoute requireAdmin={true}>
                <UsersPage />
              </ProtectedRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
