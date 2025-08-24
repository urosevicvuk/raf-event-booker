import React, { useState, useEffect } from 'react';
import type {Event} from '../../types';
import {EventService} from '../../services/eventService';
import {RSVPService} from '../../services/rsvpService';
import RSVPModal from './RSVPModal';
import './EventInteractions.css';

interface EventInteractionsProps {
  event: Event;
  onEventUpdate: (updatedEvent: Event) => void;
}

const EventInteractions: React.FC<EventInteractionsProps> = ({ 
  event, 
  onEventUpdate 
}) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState({
    canRegister: true,
    currentCount: 0,
    maxCapacity: event.maxCapacity,
    isFull: false
  });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [interactionLoading, setInteractionLoading] = useState(false);

  useEffect(() => {
    // Provera stanja reakcija iz session storage-a
    const likeKey = `liked_event_${event.id}`;
    const dislikeKey = `disliked_event_${event.id}`;
    setHasLiked(!!sessionStorage.getItem(likeKey));
    setHasDisliked(!!sessionStorage.getItem(dislikeKey));

    if (event.maxCapacity) {
      fetchRSVPStatus();
    }

    const viewKey = `viewed_event_${event.id}`;
    if (!sessionStorage.getItem(viewKey)) {
      incrementViewCount();
      sessionStorage.setItem(viewKey, 'true');
    }
  }, [event.id, event.maxCapacity]);

  const fetchRSVPStatus = async () => {
    try {
      const status = await RSVPService.getRegistrationStatus(event.id);
      setRsvpStatus({
        ...status,
        maxCapacity: status.maxCapacity || event.maxCapacity
      });
    } catch (error) {
      console.error('Error fetching RSVP status:', error);
    }
  };

  const incrementViewCount = async () => {
    try {
      await EventService.incrementView(event.id);
      onEventUpdate({ ...event, views: event.views + 1 });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleLike = async () => {
    if (interactionLoading) return;
    
    try {
      setInteractionLoading(true);
      const response = await EventService.likeEvent(event.id);
      
      const likeKey = `liked_event_${event.id}`;
      const dislikeKey = `disliked_event_${event.id}`;
      
      setHasLiked(response.hasLiked);
      setHasDisliked(response.hasDisliked);
      
      if (response.hasLiked) {
        sessionStorage.setItem(likeKey, 'true');
      } else {
        sessionStorage.removeItem(likeKey);
      }
      
      if (response.hasDisliked) {
        sessionStorage.setItem(dislikeKey, 'true');
      } else {
        sessionStorage.removeItem(dislikeKey);
      }
      
      onEventUpdate({ 
        ...event, 
        likeCount: response.likeCount,
        dislikeCount: response.dislikeCount
      });
    } catch (error) {
      console.error('Error liking event:', error);
      alert('Error processing like');
    } finally {
      setInteractionLoading(false);
    }
  };

  const handleDislike = async () => {
    if (interactionLoading) return;
    
    try {
      setInteractionLoading(true);
      const response = await EventService.dislikeEvent(event.id);
      
      const likeKey = `liked_event_${event.id}`;
      const dislikeKey = `disliked_event_${event.id}`;
      
      setHasLiked(response.hasLiked);
      setHasDisliked(response.hasDisliked);
      
      if (response.hasLiked) {
        sessionStorage.setItem(likeKey, 'true');
      } else {
        sessionStorage.removeItem(likeKey);
      }
      
      if (response.hasDisliked) {
        sessionStorage.setItem(dislikeKey, 'true');
      } else {
        sessionStorage.removeItem(dislikeKey);
      }
      
      onEventUpdate({ 
        ...event, 
        likeCount: response.likeCount,
        dislikeCount: response.dislikeCount
      });
    } catch (error) {
      console.error('Error disliking event:', error);
      alert('Error processing dislike');
    } finally {
      setInteractionLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (rsvpLoading || rsvpStatus.isFull) return;
    setRsvpModalOpen(true);
  };

  const handleRSVPSubmit = async (email: string) => {
    setRsvpLoading(true);
    try {
      await RSVPService.registerForEvent(event.id, email);
      await fetchRSVPStatus();
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <div className="event-interactions">
      <div className="interaction-section">
        <h3>Event Interactions</h3>
        
        <div className="interactions-grid">
          <div className="stats-container">
            <div className="stat">
              <span className="stat-label">Views</span>
              <span className="stat-value">👁 {event.views}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Reactions</span>
              <span className="stat-value">
                {event.likeCount + event.dislikeCount}
              </span>
            </div>
          </div>

          <div className="reactions-container">
            <div className="reaction-buttons">
              <button
                onClick={handleLike}
                className={`reaction-btn like-btn ${hasLiked ? 'active' : ''}`}
                disabled={interactionLoading}
                title={hasLiked ? 'Remove like' : 'Like this event'}
              >
                👍 {event.likeCount}
              </button>
              <button
                onClick={handleDislike}
                className={`reaction-btn dislike-btn ${hasDisliked ? 'active' : ''}`}
                disabled={interactionLoading}
                title={hasDisliked ? 'Remove dislike' : 'Dislike this event'}
              >
                👎 {event.dislikeCount}
              </button>
            </div>
          </div>

          {event.maxCapacity && (
            <div className="rsvp-container">
              <div className="rsvp-info">
                <div className="rsvp-count">
                  <strong>{rsvpStatus.currentCount}</strong>
                  {event.maxCapacity && (
                    <span> / {event.maxCapacity}</span>
                  )}
                  <span> registered</span>
                </div>
                
                {rsvpStatus.isFull ? (
                  <button className="rsvp-btn full" disabled>
                    Event Full
                  </button>
                ) : (
                  <button
                    onClick={handleRSVP}
                    className="rsvp-btn"
                    disabled={rsvpLoading}
                  >
                    {rsvpLoading ? 'Registering...' : 'RSVP'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <RSVPModal
        isOpen={rsvpModalOpen}
        onClose={() => setRsvpModalOpen(false)}
        onSubmit={handleRSVPSubmit}
        eventTitle={event.title}
        rsvpStatus={rsvpStatus}
        loading={rsvpLoading}
      />
    </div>
  );
};

export default EventInteractions;