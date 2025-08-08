import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavBar } from '../../components/common/PublicNavBar';
import type { Event } from '../../types';
import './HomePage.css';

// Mock data - this will be replaced with API calls
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Rock Koncert - The Best Band',
    description: 'Nezaboravan rock koncert sa najboljim hitovima. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: '2025-08-01T10:00:00Z',
    eventDate: '2025-08-15T20:00:00Z',
    location: 'Arena Belgrade',
    views: 150,
    likeCount: 45,
    dislikeCount: 3,
    authorId: 1,
    categoryId: 1,
    maxCapacity: 500,
    author: { id: 1, email: 'creator@raf.rs', firstName: 'Marko', lastName: 'Petrović', userType: 'event creator', status: 'active' },
    category: { id: 1, name: 'Koncerti', description: 'Muzički događaji' },
    tags: [{ id: 1, name: 'rock' }, { id: 2, name: 'muzika' }]
  },
  {
    id: 2,
    title: 'IT Konferencija 2025',
    description: 'Najveća IT konferencija u regionu. Predavanja o najnovijim tehnologijama, AI, blockchain i mnogo više.',
    createdAt: '2025-07-28T14:30:00Z',
    eventDate: '2025-09-10T09:00:00Z',
    location: 'Sava Centar',
    views: 320,
    likeCount: 78,
    dislikeCount: 5,
    authorId: 2,
    categoryId: 2,
    author: { id: 2, email: 'admin@raf.rs', firstName: 'Ana', lastName: 'Milić', userType: 'admin', status: 'active' },
    category: { id: 2, name: 'Konferencije', description: 'Poslovni događaji' },
    tags: [{ id: 3, name: 'IT' }, { id: 4, name: 'tehnologija' }, { id: 5, name: 'networking' }]
  },
  {
    id: 3,
    title: 'Radionica fotografije',
    description: 'Naučite osnove fotografije sa profesionalnim fotografom. Praktične vežbe i saveti za bolje slike.',
    createdAt: '2025-07-25T09:15:00Z',
    eventDate: '2025-08-20T14:00:00Z',
    location: 'Kulturni centar Belgrade',
    views: 85,
    likeCount: 32,
    dislikeCount: 1,
    authorId: 1,
    categoryId: 3,
    maxCapacity: 20,
    author: { id: 1, email: 'creator@raf.rs', firstName: 'Marko', lastName: 'Petrović', userType: 'event creator', status: 'active' },
    category: { id: 3, name: 'Radionice', description: 'Edukativni sadržaji' },
    tags: [{ id: 6, name: 'fotografija' }, { id: 7, name: 'umetnost' }]
  }
];

export const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="home-page">
        <PublicNavBar />
        <div className="loading-container">
          <div className="loading-spinner">Učitavanje...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <PublicNavBar />
      
      <main className="main-content">
        <div className="hero-section">
          <h1>Dobrodošli na RAF Event Booker</h1>
          <p>Otkrijte najzanimljivije događaje u vašem gradu</p>
        </div>

        <div className="events-section">
          <h2>Najnoviji događaji</h2>
          <div className="events-grid">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3>
                    <Link to={`/event/${event.id}`} className="event-title">
                      {event.title}
                    </Link>
                  </h3>
                  <div className="event-meta">
                    <span className="event-category">{event.category?.name}</span>
                    <span className="event-date">{formatDate(event.eventDate)}</span>
                  </div>
                </div>

                <div className="event-body">
                  <p className="event-description">
                    {truncateText(event.description)}
                  </p>
                  <div className="event-details">
                    <span className="event-location">📍 {event.location}</span>
                    <span className="event-author">👤 {event.author?.firstName} {event.author?.lastName}</span>
                  </div>
                </div>

                <div className="event-footer">
                  <div className="event-stats">
                    <span className="stat">👀 {event.views}</span>
                    <span className="stat">👍 {event.likeCount}</span>
                    <span className="stat">👎 {event.dislikeCount}</span>
                  </div>
                  <div className="event-tags">
                    {event.tags?.map(tag => (
                      <span key={tag.id} className="tag">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {event.maxCapacity && (
                  <div className="capacity-info">
                    Kapacitet: {event.maxCapacity} mesta
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <p>&copy; 2025 RAF Event Booker. Sva prava zadržana.</p>
      </footer>
    </div>
  );
};