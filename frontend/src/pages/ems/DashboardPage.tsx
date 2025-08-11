import React from 'react';
import EMSLayout from '../../components/ems/EMSLayout';
import { useAuth } from '../../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user, isAdmin, isEventCreator } = useAuth();

  return (
    <EMSLayout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome to the Event Management System</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>Welcome, {user?.firstName}!</h2>
        </div>
        <div className="card-content">
          <p>
            You are logged in as: <strong>{user?.userType}</strong>
          </p>
          <p>Account Status: <strong>{user?.status}</strong></p>

          <div style={{ marginTop: '20px' }}>
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {isEventCreator && (
                <>
                  <a href="/ems/categories" className="btn btn-primary">
                    Manage Categories
                  </a>
                  <a href="/ems/events" className="btn btn-primary">
                    Manage Events
                  </a>
                  <a href="/ems/search" className="btn btn-secondary">
                    Search Events
                  </a>
                </>
              )}
              {isAdmin && (
                <a href="/ems/users" className="btn btn-warning">
                  Manage Users
                </a>
              )}
              <a href="/" className="btn btn-secondary">
                View Public Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </EMSLayout>
  );
};

export default DashboardPage;