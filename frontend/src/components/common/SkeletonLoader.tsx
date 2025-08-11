import React from 'react';
import './LoadingStates.css';

interface SkeletonLoaderProps {
  type: 'event-card' | 'navigation' | 'form' | 'custom';
  count?: number;
  className?: string;
  children?: React.ReactNode;
}

const EventCardSkeleton: React.FC = () => (
  <div className="event-card-skeleton">
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton-meta">
      <div className="skeleton skeleton-meta-item"></div>
      <div className="skeleton skeleton-meta-item"></div>
      <div className="skeleton skeleton-meta-item"></div>
    </div>
    <div className="skeleton skeleton-description"></div>
    <div className="skeleton skeleton-description short"></div>
    <div className="skeleton-tags">
      <div className="skeleton skeleton-tag"></div>
      <div className="skeleton skeleton-tag"></div>
      <div className="skeleton skeleton-tag"></div>
    </div>
  </div>
);

const NavigationSkeleton: React.FC = () => (
  <div className="navbar-skeleton">
    <div className="skeleton skeleton-logo"></div>
    <div className="skeleton-nav-menu">
      <div className="skeleton skeleton-nav-item"></div>
      <div className="skeleton skeleton-nav-item"></div>
      <div className="skeleton skeleton-nav-item"></div>
    </div>
    <div className="skeleton skeleton-search"></div>
    <div className="skeleton skeleton-user"></div>
  </div>
);

const FormSkeleton: React.FC = () => (
  <div className="form-skeleton">
    <div className="skeleton-form-group">
      <div className="skeleton skeleton-label"></div>
      <div className="skeleton skeleton-input"></div>
    </div>
    <div className="skeleton-form-group">
      <div className="skeleton skeleton-label"></div>
      <div className="skeleton skeleton-input"></div>
    </div>
    <div className="skeleton-form-group">
      <div className="skeleton skeleton-label"></div>
      <div className="skeleton skeleton-input"></div>
    </div>
    <div className="skeleton skeleton-button"></div>
  </div>
);

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type, 
  count = 1, 
  className = '', 
  children 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'event-card':
        return Array.from({ length: count }, (_, index) => (
          <EventCardSkeleton key={index} />
        ));
      case 'navigation':
        return <NavigationSkeleton />;
      case 'form':
        return <FormSkeleton />;
      case 'custom':
        return children;
      default:
        return null;
    }
  };

  return (
    <div className={`skeleton-container ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;