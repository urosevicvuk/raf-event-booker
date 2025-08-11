import React from 'react';
import './LoadingStates.css';

interface PageLoaderProps {
  message?: string;
  type?: 'spinner' | 'pulse' | 'wave';
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...', 
  type = 'spinner' 
}) => {
  const renderLoader = () => {
    switch (type) {
      case 'pulse':
        return (
          <div className="pulse-loader">
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>
        );
      case 'wave':
        return (
          <div className="wave-loader">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        );
      case 'spinner':
      default:
        return <div className="spinner large"></div>;
    }
  };

  return (
    <div className="page-loading-overlay">
      <div className="loading-content">
        <div className="loading-logo">RAF Event Booker</div>
        <div className="loading-text">{message}</div>
        {renderLoader()}
      </div>
    </div>
  );
};

export default PageLoader;