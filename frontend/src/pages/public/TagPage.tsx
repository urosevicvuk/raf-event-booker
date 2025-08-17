import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import type {Event, Tag} from '../../types';
import {EventService} from '../../services/eventService';
import {TagService} from '../../services/tagService';

const TagPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tagId = parseInt(id || '0', 10);
  
  const [tag, setTag] = useState<Tag | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const limit = 10;

  useEffect(() => {
    if (tagId) {
      fetchTag();
      fetchEvents(1, true);
    }
  }, [tagId]);

  const fetchTag = async () => {
    try {
      const data = await TagService.getTagById(tagId);
      setTag(data);
    } catch (error) {
      console.error('Error fetching tag:', error);
      setTag(null);
    }
  };

  const fetchEvents = async (pageNum: number, reset: boolean = false) => {
    try {
      if (reset) setLoading(true);
      else setEventsLoading(true);
      
      const response = await EventService.getEventsByTag(tagId, pageNum, limit);
      const newEvents = response.events || [];
      
      if (reset) {
        setEvents(newEvents);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
      
      setHasMore(newEvents.length === limit);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching events:', error);
      if (reset) setEvents([]);
    } finally {
      setLoading(false);
      setEventsLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchEvents(page + 1, false);
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
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading tagged events...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!tag) {
    return (
      <PublicLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Tag Not Found</h2>
          <p>The tag you're looking for doesn't exist.</p>
          <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>
            ← Back to Home
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="page-header">
        <h1>#{tag.name}</h1>
        <p>Events tagged with "{tag.name}"</p>
      </div>

      <div style={{ padding: '0' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>Events tagged with #{tag.name}</h2>
            <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </div>
          <p style={{ margin: 0, color: '#7f8c8d' }}>
            {events.length} event{events.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <h3>No events with this tag</h3>
            <p>There are currently no events tagged with "#{tag.name}".</p>
          </div>
        ) : (
          <>
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
                    {event.tags.map(eventTag => (
                      <Link 
                        key={eventTag.id} 
                        to={`/tag/${eventTag.id}`} 
                        className={`tag ${eventTag.id === tagId ? 'current-tag' : ''}`}
                      >
                        {eventTag.name}
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

            {hasMore && (
              <div style={{ padding: '30px', textAlign: 'center', borderTop: '1px solid #eee' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={eventsLoading}
                  style={{
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  {eventsLoading ? 'Loading...' : 'Load More Events'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
    </PublicLayout>
  );
};

export default TagPage;