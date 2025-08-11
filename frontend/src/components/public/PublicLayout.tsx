import React from 'react';
import PublicNavBar from './PublicNavBar';
import MostReactedSidebar from './MostReactedSidebar';
import './PublicLayout.css';

interface PublicLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  showSidebar = true 
}) => {
  return (
    <div className="public-layout theme-public">
      <PublicNavBar />
      <main className="public-content">
        <div className={`content-container ${!showSidebar ? 'no-sidebar' : ''}`}>
          <div className="main-content">
            {children}
          </div>
          {showSidebar && (
            <aside className="sidebar">
              <MostReactedSidebar />
            </aside>
          )}
        </div>
      </main>
      <footer className="public-footer">
        <div className="footer-container">
          <p>&copy; 2025 RAF Event Booker. Built for RAF students and events.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;