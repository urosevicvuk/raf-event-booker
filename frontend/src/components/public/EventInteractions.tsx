import React, { useState, useEffect } from 'react';
import type {Event} from '../../types';
import EventService from '../../services/eventService';
import RSVPService from '../../services/rsvpService';
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
  const [interactionLoading, setInteractionLoading] = useState(false);

  useEffect(() => {
    // Check like/dislike status from session storage
    const likeKey = `liked_event_${event.id}`;
    const dislikeKey = `disliked_event_${event.id}`;
    setHasLiked(!!sessionStorage.getItem(likeKey));
    setHasDisliked(!!sessionStorage.getItem(dislikeKey));

    // Fetch RSVP status
    if (event.maxCapacity) {
      fetchRSVPStatus();
    }

    // Increment view count (only once per session)
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
      // Update local event object
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
      
      if (response.action === 'liked') {
        setHasLiked(true);
        setHasDisliked(false);
        sessionStorage.setItem(likeKey, 'true');
        sessionStorage.removeItem(dislikeKey);
        onEventUpdate({ 
          ...event, 
          likeCount: hasDisliked ? event.likeCount + 1 : event.likeCount + 1,
          dislikeCount: hasDisliked ? event.dislikeCount - 1 : event.dislikeCount
        });
      } else if (response.action === 'unliked') {
        setHasLiked(false);
        sessionStorage.removeItem(likeKey);
        onEventUpdate({ 
          ...event, 
          likeCount: event.likeCount - 1
        });
      }
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
      
      if (response.action === 'disliked') {
        setHasDisliked(true);
        setHasLiked(false);
        sessionStorage.setItem(dislikeKey, 'true');
        sessionStorage.removeItem(likeKey);
        onEventUpdate({ 
          ...event, 
          dislikeCount: hasLiked ? event.dislikeCount + 1 : event.dislikeCount + 1,
          likeCount: hasLiked ? event.likeCount - 1 : event.likeCount
        });
      } else if (response.action === 'undisliked') {
        setHasDisliked(false);
        sessionStorage.removeItem(dislikeKey);
        onEventUpdate({ 
          ...event, 
          dislikeCount: event.dislikeCount - 1
        });
      }
    } catch (error) {
      console.error('Error disliking event:', error);
      alert('Error processing dislike');
    } finally {
      setInteractionLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (rsvpLoading || rsvpStatus.isFull) return;

    const email = prompt('Please enter your email to RSVP:');
    if (!email || !email.trim()) return;

    try {
      setRsvpLoading(true);
      await RSVPService.registerForEvent(event.id, email.trim());
      await fetchRSVPStatus(); // Refresh status
      alert('Successfully registered for this event!');
    } catch (error: any) {
      console.error('Error registering for event:', error);
      if (error.response?.status === 409) {
        alert('You are already registered for this event');
      } else if (error.response?.status === 400) {
        alert('Event is at full capacity');
      } else {
        alert('Error registering for event');
      }
    } finally {
      setRsvpLoading(false);
    }
  };

  return (
    <div className="event-interactions">
      <div className="interaction-section">
        <h3>React to this Event</h3>
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
        <div className="interaction-section">
          <h3>RSVP</h3>
          <div className="rsvp-info">
            <p>
              <strong>{rsvpStatus.currentCount}</strong>
              {event.maxCapacity && (
                <span> / {event.maxCapacity}</span>
              )}
              <span> registered</span>
            </p>
            
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

      <div className="interaction-section">
        <div className="event-stats">
          <div className="stat">
            <span className="stat-label">Views</span>
            <span className="stat-value">👁 {event.views}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Reactions</span>
            <span className="stat-value">
              {event.likeCount + event.dislikeCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInteractions;