import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type {Event} from '../../types';
import EventService from '../../services/eventService';

const MostReactedSidebar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMostReactedEvents();
  }, []);

  const fetchMostReactedEvents = async () => {
    try {
      setLoading(true);
      const data = await EventService.getMostReactedEvents(3);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching most reacted events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="sidebar-widget">
        <h3>Most Reactions</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="sidebar-widget">
        <h3>Most Reactions</h3>
        <p>No events with reactions yet.</p>
      </div>
    );
  }

  return (
    <div className="sidebar-widget">
      <h3>Most Reactions</h3>
      <div className="sidebar-events">
        {events.map(event => (
          <div key={event.id} className="sidebar-event">
            <Link to={`/event/${event.id}`} className="sidebar-event-link">
              <h4>{event.title}</h4>
              <div className="sidebar-event-meta">
                <span className="reactions-count">
                  👍 {event.likeCount} 👎 {event.dislikeCount}
                </span>
                <span className="category">
                  {event.category?.name}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostReactedSidebar;