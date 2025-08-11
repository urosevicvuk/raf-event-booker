import React from 'react';
import EMSNavBar from './EMSNavBar';
import './EMSLayout.css';

interface EMSLayoutProps {
  children: React.ReactNode;
}

const EMSLayout: React.FC<EMSLayoutProps> = ({ children }) => {
  return (
    <div className="ems-layout">
      <EMSNavBar />
      <main className="ems-content">
        {children}
      </main>
    </div>
  );
};

export default EMSLayout;