import React, { useState } from 'react';
import './RSVPModal.css';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  eventTitle: string;
  rsvpStatus: {
    canRegister: boolean;
    currentCount: number;
    maxCapacity?: number;
    isFull: boolean;
  };
  loading: boolean;
}

const RSVPModal: React.FC<RSVPModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  eventTitle,
  rsvpStatus,
  loading
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit(email.trim());
      setEmail('');
      onClose();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setError('You are already registered for this event');
      } else if (error.response?.status === 400) {
        setError('Event is at full capacity');
      } else {
        setError('Error registering for event. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rsvp-modal-overlay" onClick={handleClose}>
      <div className="rsvp-modal" onClick={e => e.stopPropagation()}>
        <div className="rsvp-modal-header">
          <h2>RSVP for Event</h2>
          <button 
            className="rsvp-modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="rsvp-modal-content">
          <div className="event-info">
            <h3>{eventTitle}</h3>
            {rsvpStatus.maxCapacity && (
              <div className="capacity-info">
                <div className="capacity-progress">
                  <div 
                    className="capacity-fill"
                    style={{ 
                      width: `${(rsvpStatus.currentCount / rsvpStatus.maxCapacity) * 100}%` 
                    }}
                  />
                </div>
                <p className="capacity-text">
                  {rsvpStatus.currentCount} / {rsvpStatus.maxCapacity} registered
                </p>
              </div>
            )}
          </div>

          {rsvpStatus.isFull ? (
            <div className="rsvp-status-message error">
              <p>Sorry, this event is at full capacity.</p>
            </div>
          ) : !rsvpStatus.canRegister ? (
            <div className="rsvp-status-message error">
              <p>RSVP is not available for this event.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rsvp-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={error ? 'error' : ''}
                  disabled={isSubmitting}
                  autoFocus
                />
                {error && <div className="error-message">{error}</div>}
              </div>

              <div className="rsvp-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RSVPModal;