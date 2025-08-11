import React, { useState } from 'react';
import EMSLayout from '../../components/ems/EMSLayout';
import Table from '../../components/common/Table';
import type {Event} from '../../types';
import EventService from '../../services/eventService';
import './SearchPage.css';

const EventSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const limit = 10;

  const handleSearch = async (page: number = 1) => {
    if (!searchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      const response = await EventService.searchEvents(searchTerm.trim(), page, limit);
      setEvents(response.events || []);
      setCurrentPage(page);
      setHasSearched(true);
      setTotalResults(response.events?.length || 0);
    } catch (error) {
      console.error('Error searching events:', error);
      alert('Error searching events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    handleSearch(1);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    handleSearch(nextPage);
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    handleSearch(prevPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleViewEvent = (event: Event) => {
    window.open(`/event/${event.id}`, '_blank');
  };

  const columns = [
    { 
      key: 'title' as const, 
      label: 'Title',
      render: (event: Event) => (
        <div>
          <strong>{event.title}</strong>
          <br />
          <small style={{ color: '#666' }}>
            {event.category?.name || 'Unknown Category'}
          </small>
        </div>
      )
    },
    { 
      key: 'description' as const, 
      label: 'Description',
      render: (event: Event) => truncateText(event.description)
    },
    { 
      key: 'eventDate' as const, 
      label: 'Event Date',
      render: (event: Event) => formatDate(event.eventDate)
    },
    { 
      key: 'location' as const, 
      label: 'Location' 
    },
    { 
      key: 'author' as const, 
      label: 'Author',
      render: (event: Event) => (
        event.author ? `${event.author.firstName} ${event.author.lastName}` : 'Unknown'
      )
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      render: (event: Event) => (
        <div className="table-actions">
          <button
            onClick={() => handleViewEvent(event)}
            className="btn btn-sm btn-primary"
            title="View on public site"
          >
            View Event
          </button>
        </div>
      )
    }
  ];

  return (
    <EMSLayout>
      <div className="page-header">
        <h1>Search Events</h1>
        <p>Search for events by title or description</p>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>Event Search</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Enter search term (title or description)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {hasSearched && (
            <div className="search-results">
              <div className="search-results-header">
                <h3>
                  Search Results 
                  {searchTerm && (
                    <span className="search-term">for "{searchTerm}"</span>
                  )}
                </h3>
                {totalResults > 0 && (
                  <p className="results-count">
                    Page {currentPage}, showing {totalResults} result(s)
                  </p>
                )}
              </div>

              <Table
                data={events}
                columns={columns}
                loading={loading}
                emptyMessage="No events found matching your search criteria."
              />

              {events.length >= limit && (
                <div className="pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || loading}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>
                  <span className="page-info">Page {currentPage}</span>
                  <button
                    onClick={handleNextPage}
                    disabled={events.length < limit || loading}
                    className="btn btn-secondary"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </EMSLayout>
  );
};

export default EventSearchPage;