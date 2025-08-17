import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import Pagination from '../../components/common/Pagination';
import type {Event, Category} from '../../types';
import {EventService} from '../../services/eventService';
import {CategoryService} from '../../services/categoryService';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || '0', 10);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const limit = 10;

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
      fetchEvents();
    }
  }, [categoryId, currentPage]);

  const fetchCategory = async () => {
    try {
      const data = await CategoryService.getCategoryById(categoryId);
      setCategory(data);
    } catch (error) {
      console.error('Error fetching category:', error);
      setCategory(null);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const response = await EventService.getEventsByCategory(categoryId, currentPage, limit);
      const newEvents = response.events || [];
      
      setEvents(newEvents);
      
      // Calculate total pages from total count  
      if (response.total) {
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <p>Loading category events...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!category) {
    return (
      <PublicLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Category Not Found</h2>
          <p>The category you're looking for doesn't exist.</p>
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
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </div>

      <div style={{ padding: '0' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>Events in {category.name}</h2>
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
            <h3>No events in this category</h3>
            <p>There are currently no events in the "{category.name}" category.</p>
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

            {totalPages > 1 && (
              <div style={{ padding: '30px', borderTop: '1px solid #eee' }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default CategoryPage;