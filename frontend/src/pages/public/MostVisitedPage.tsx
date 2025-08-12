import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import type {Event} from '../../types';
import EventService from '../../services/eventService';

const MostVisitedPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMostVisitedEvents();
  }, []);

  const fetchMostVisitedEvents = async () => {
    try {
      setLoading(true);
      const data = await EventService.getMostVisitedEventsLast30Days(10);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching most visited events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateDescription = (text: string, maxLength: number = 200) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="page-header">
          <h1>Most Visited Events</h1>
          <p>Popular events from the last 30 days</p>
        </div>
        <div className="content-section" style={{ textAlign: 'center' }}>
          <p>Loading most visited events...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="page-header">
        <h1>Most Visited Events</h1>
        <p>Popular events from the last 30 days</p>
      </div>

      <div className="content-section">
        <h2>Top 10 Most Visited</h2>
        <p>Events ranked by number of views in the past 30 days</p>

        {events.length === 0 ? (
          <div className="empty-state">
            <h3>No visited events</h3>
            <p>No events have been viewed in the last 30 days.</p>
          </div>
        ) : (
          <div style={{ padding: 0 }}>
            {events.map((event, index) => (
              <div key={event.id} className="event-card">
                <div className="event-card-with-ranking">
                  <div className="ranking-badge">
                    {index + 1}
                  </div>
                  
                  <div className="event-card-content">
                    <h3>
                      <Link to={`/event/${event.id}`}>{event.title}</Link>
                    </h3>
                    
                    <div className="event-meta">
                      <span>📅 {formatDate(event.eventDate)}</span>
                      <span>📍 {event.location}</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--error)' }}>
                        👁 {event.views} views
                      </span>
                      <span>📂 {event.category?.name}</span>
                      <span>
                        👍 {event.likeCount} 👎 {event.dislikeCount}
                      </span>
                    </div>

                    <div className="event-description">
                      {truncateDescription(event.description)}
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div className="event-tags">
                        {event.tags.map(tag => (
                          <Link key={tag.id} to={`/tag/${tag.id}`} className="tag">
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default MostVisitedPage;