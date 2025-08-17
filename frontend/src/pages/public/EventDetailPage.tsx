import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import EventInteractions from '../../components/public/EventInteractions';
import EventComments from '../../components/public/EventComments';
import type {Event} from '../../types';
import {EventService} from '../../services/eventService';
import './EventDetailPage.css';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = parseInt(id || '0', 10);
  
  const [event, setEvent] = useState<Event | null>(null);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    if (event) {
      fetchSimilarEvents();
    }
  }, [event]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await EventService.getEventById(eventId);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarEvents = async () => {
    if (!event) return;
    
    try {
      setSimilarLoading(true);
      const data = await EventService.getSimilarEvents(event.id, 3);
      setSimilarEvents(data);
    } catch (error) {
      console.error('Error fetching similar events:', error);
      setSimilarEvents([]);
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleEventUpdate = (updatedEvent: Event) => {
    setEvent(updatedEvent);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCreatedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="loading-container">
          <p>Loading event details...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!event) {
    return (
      <PublicLayout>
        <div className="error-container">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="back-home-btn">
            ← Back to Home
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="event-detail">
        <div className="event-header">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span> › </span>
            {event.category && (
              <>
                <Link to={`/category/${event.category.id}`}>{event.category.name}</Link>
                <span> › </span>
              </>
            )}
            <span>{event.title}</span>
          </div>
          
          <h1>{event.title}</h1>
          
          <div className="event-meta">
            <div className="meta-item">
              <strong>📅 Date:</strong> {formatDate(event.eventDate)}
            </div>
            <div className="meta-item">
              <strong>📍 Location:</strong> {event.location}
            </div>
            <div className="meta-item">
              <strong>📂 Category:</strong> {event.category?.name}
            </div>
            <div className="meta-item">
              <strong>👤 Organizer:</strong> {event.author ? `${event.author.firstName} ${event.author.lastName}` : 'Unknown'}
            </div>
            <div className="meta-item">
              <strong>📅 Published:</strong> {formatCreatedDate(event.createdAt)}
            </div>
            {event.maxCapacity && (
              <div className="meta-item">
                <strong>👥 Capacity:</strong> {event.maxCapacity} people
              </div>
            )}
          </div>
        </div>

        <div className="event-content">
          <div className="event-description">
            <h2>About This Event</h2>
            <div className="description-text">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            {event.tags && event.tags.length > 0 && (
              <div className="event-tags">
                <h3>Tags</h3>
                <div className="tags-list">
                  {event.tags.map(tag => (
                    <Link key={tag.id} to={`/tag/${tag.id}`} className="tag">
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <EventInteractions 
          event={event} 
          onEventUpdate={handleEventUpdate}
        />

        <EventComments eventId={event.id} />

        {similarEvents.length > 0 && (
          <div className="similar-events">
            <div className="similar-events-header">
              <h2>Read More</h2>
              <p>Similar events you might be interested in</p>
            </div>
            
            {similarLoading ? (
              <div className="loading-similar">Loading similar events...</div>
            ) : (
              <div className="similar-events-list">
                {similarEvents.map(similarEvent => (
                  <div key={similarEvent.id} className="similar-event-card">
                    <h4>
                      <Link to={`/event/${similarEvent.id}`}>
                        {similarEvent.title}
                      </Link>
                    </h4>
                    <div className="similar-event-meta">
                      <span>📅 {formatCreatedDate(similarEvent.eventDate)}</span>
                      <span>📂 {similarEvent.category?.name}</span>
                      <span>👁 {similarEvent.views} views</span>
                    </div>
                    <p className="similar-event-description">
                      {similarEvent.description.length > 150 
                        ? similarEvent.description.substring(0, 150) + '...' 
                        : similarEvent.description
                      }
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default EventDetailPage;