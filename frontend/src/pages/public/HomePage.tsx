import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import type {Event} from '../../types';
import EventService from '../../services/eventService';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestEvents();
  }, []);

  const fetchLatestEvents = async () => {
    try {
      setLoading(true);
      const data = await EventService.getLatestEvents(10);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching latest events:', error);
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
          <h1>Welcome to RAF Event Booker</h1>
          <p>Discover and join exciting events at RAF</p>
        </div>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading latest events...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="page-header">
        <h1>Welcome to RAF Event Booker</h1>
        <p>Discover and join exciting events at RAF</p>
      </div>

      <div style={{ padding: '0' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Latest Events</h2>
          <p style={{ margin: 0, color: '#7f8c8d' }}>
            Here are the 10 most recently created events
          </p>
        </div>

        {events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <h3>No events available</h3>
            <p>Check back later for new events!</p>
          </div>
        ) : (
          <div>
            {events.map(event => (
              <div key={event.id} className="event-card">
                <h3>
                  <Link to={`/event/${event.id}`}>{event.title}</Link>
                </h3>
                
                <div className="event-meta">
                  <span>📅 {formatDate(event.eventDate)}</span>
                  <span>📍 {event.location}</span>
                  <span>👁 {event.views} views</span>
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
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default HomePage;