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
        <div style={{ padding: '40px', textAlign: 'center' }}>
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

      <div style={{ padding: '0' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Top 10 Most Visited</h2>
          <p style={{ margin: 0, color: '#7f8c8d' }}>
            Events ranked by number of views in the past 30 days
          </p>
        </div>

        {events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <h3>No visited events</h3>
            <p>No events have been viewed in the last 30 days.</p>
          </div>
        ) : (
          <div>
            {events.map((event, index) => (
              <div key={event.id} className="event-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div 
                    style={{ 
                      background: '#3498db', 
                      color: 'white', 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}
                  >
                    {index + 1}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>
                      <Link to={`/event/${event.id}`}>{event.title}</Link>
                    </h3>
                    
                    <div className="event-meta">
                      <span>📅 {formatDate(event.eventDate)}</span>
                      <span>📍 {event.location}</span>
                      <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>
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

                    <div style={{ marginTop: '15px' }}>
                      <Link 
                        to={`/event/${event.id}`} 
                        style={{ 
                          color: '#3498db', 
                          textDecoration: 'none',
                          fontWeight: 500
                        }}
                      >
                        View Details →
                      </Link>
                    </div>
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