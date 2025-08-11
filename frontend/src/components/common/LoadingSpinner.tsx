import React from 'react';
import './LoadingStates.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', className = '' }) => {
  const sizeClass = size === 'small' ? 'small' : size === 'large' ? 'large' : '';
  
  return (
    <div className={`spinner-container ${className}`}>
      <div className={`spinner ${sizeClass}`}></div>
    </div>
  );
};

export default LoadingSpinner;