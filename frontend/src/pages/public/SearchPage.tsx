import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import Pagination from '../../components/common/Pagination';
import type {Event} from '../../types';
import {EventService} from '../../services/eventService';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const limit = 10;

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      // Load all events on initial page load when no query
      performSearch("");
    }
  }, [initialQuery]);

  useEffect(() => {
    if (hasSearched) {
      performSearch(searchTerm);
    }
  }, [currentPage]);

  const performSearch = async (query: string) => {
    try {
      setLoading(true);
      
      const response = await EventService.searchEvents(query.trim(), currentPage, limit);
      const newEvents = response.events || [];
      
      setEvents(newEvents);
      setHasSearched(true);
      
      // Calculate total pages based on returned events count (simple approach)
      if (newEvents.length === limit) {
        setTotalPages(currentPage + 1); // There might be more pages
      } else {
        setTotalPages(currentPage); // This is likely the last page
      }
    } catch (error) {
      console.error('Error searching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch(searchTerm);
    // Update URL using React Router hooks
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    performSearch('');
    setSearchParams({});
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

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ background: '#fff3cd', padding: '0 2px' }}>
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <PublicLayout>
      <div className="page-header">
        <h1>Search Events</h1>
        <p>Find events by title, description, or keywords</p>
      </div>

      <div style={{ padding: '0' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', alignItems: 'center', maxWidth: '600px' }}>
            <input
              type="text"
              placeholder="Search for events... (leave empty to show all events)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
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
              {loading ? 'Loading...' : 'Search'}
            </button>
            {searchTerm && (
              <button 
                type="button"
                onClick={handleClearSearch}
                disabled={loading}
                style={{
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Clear
              </button>
            )}
          </form>
          
          <div style={{ marginTop: '15px' }}>
            <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </div>
        </div>

        {hasSearched && (
          <div style={{ padding: '30px', borderBottom: '1px solid #eee' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
              {searchTerm ? `Search Results for "${searchTerm}"` : 'All Events'}
            </h2>
            <p style={{ margin: 0, color: '#7f8c8d' }}>
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </p>
          </div>
        )}

        {loading && events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Searching...</p>
          </div>
        ) : hasSearched && events.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <h3>No events found</h3>
            <p>No events match your search criteria. Try different keywords or check your spelling.</p>
          </div>
        ) : !hasSearched ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <h3>Loading Events...</h3>
            <p>Getting all available events for you.</p>
          </div>
        ) : (
          <>
            {events.map(event => (
              <div key={event.id} className="event-card">
                <h3>
                  <Link to={`/event/${event.id}`}>
                    {highlightSearchTerm(event.title, searchTerm)}
                  </Link>
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
                  {highlightSearchTerm(truncateDescription(event.description), searchTerm)}
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="event-tags">
                    {event.tags.map(tag => (
                      <Link key={tag.id} to={`/tag/${tag.id}`} className="tag">
                        {highlightSearchTerm(tag.name, searchTerm)}
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

export default SearchPage;