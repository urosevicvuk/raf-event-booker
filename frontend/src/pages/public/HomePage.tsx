import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import type {Event, Category} from '../../types';
import EventService from '../../services/eventService';
import CategoryService from '../../services/categoryService';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  // Actual counts for display
  const [totalEventCount, setTotalEventCount] = useState(0);
  const [totalCategoryCount, setTotalCategoryCount] = useState(0);
  // Category pagination
  const [currentCategoryPage, setCurrentCategoryPage] = useState(0);
  const categoriesPerPage = 4;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsData, categoriesData, eventCount] = await Promise.all([
        EventService.getLatestEvents(10), // Show 10 most recent events
        CategoryService.getAllCategories(),
        EventService.getEventCount() // Get actual total count
      ]);
      
      setEvents(eventsData);
      setCategories(categoriesData); // Store all categories for pagination
      setTotalEventCount(eventCount.count); // Set actual total event count
      setTotalCategoryCount(categoriesData.length); // Set actual total category count
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateDescription = (text: string, maxLength: number = 200) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Category pagination functions
  const totalCategoryPages = Math.ceil(categories.length / categoriesPerPage);
  const currentCategories = categories.slice(
    currentCategoryPage * categoriesPerPage,
    (currentCategoryPage + 1) * categoriesPerPage
  );

  const handlePrevCategories = () => {
    setCurrentCategoryPage(prev => Math.max(0, prev - 1));
  };

  const handleNextCategories = () => {
    setCurrentCategoryPage(prev => Math.min(totalCategoryPages - 1, prev + 1));
  };

  return (
    <PublicLayout showSidebar={false}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="hero-highlight">RAF Event Booker</span>
          </h1>
          <p className="hero-subtitle">
            Discover, join, and create amazing events at the Faculty of Computing. 
            Connect with fellow students and expand your horizons.
          </p>
          <div className="hero-actions">
            <Link to="/search" className="btn btn-primary btn-lg hero-btn">
              🔍 Explore Events
            </Link>
            <Link to="/most-visited" className="btn btn-secondary btn-lg hero-btn">
              🔥 Trending
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">{totalEventCount}</div>
            <div className="stat-label">Active Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalCategoryCount}</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Students</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Find events that match your interests</p>
          </div>
          
          <div className="categories-pagination-container">
            {/* Left Arrow */}
            <button
              onClick={handlePrevCategories}
              disabled={currentCategoryPage === 0}
              className="category-nav-btn category-nav-prev"
              style={{
                opacity: currentCategoryPage === 0 ? 0.3 : 1,
                cursor: currentCategoryPage === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              &#8249;
            </button>

            {/* Categories Row */}
            <div className="categories-row">
              {currentCategories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="category-card-horizontal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="category-icon">📂</div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </Link>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNextCategories}
              disabled={currentCategoryPage >= totalCategoryPages - 1}
              className="category-nav-btn category-nav-next"
              style={{
                opacity: currentCategoryPage >= totalCategoryPages - 1 ? 0.3 : 1,
                cursor: currentCategoryPage >= totalCategoryPages - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              &#8250;
            </button>
          </div>

          {/* Category pagination indicator */}
          {totalCategoryPages > 1 && (
            <div className="category-pagination-dots">
              {Array.from({ length: totalCategoryPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentCategoryPage(i)}
                  className={`pagination-dot ${i === currentCategoryPage ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Latest Events Section */}
      <section className="section">
        <div className="section-header">
          <h2>Latest Events</h2>
          <p>Recently added events you shouldn't miss</p>
        </div>

        {loading ? (
          <div className="events-loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="event-skeleton">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-tags"></div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No events available</h3>
            <p>Check back later for new events!</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event, index) => (
              <article
                key={event.id}
                className="event-card-modern"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
              <div className="event-content">
                <div className="event-date-badge">
                  <div className="event-day">
                    {new Date(event.eventDate).getDate()} { }
                    {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  </div>
                  <h3 className="event-title">
                    <Link to={`/event/${event.id}`}>{event.title}</Link>
                  </h3>

                  <div className="event-meta-modern">
                    <span>📍 {event.location}</span>
                    <span>👁 {event.views}</span>
                    <span>👍 {event.likeCount}</span>
                  </div>

                  <p className="event-description-modern">
                    {truncateDescription(event.description, 120)}
                  </p>
                  <p className="created-at">
                    {event.createdAt}
                  </p>

                  {event.tags && event.tags.length > 0 && (
                    <div className="event-tags-modern">
                      {event.tags.slice(0, 3).map(tag => (
                        <Link
                          key={tag.id}
                          to={`/tag/${tag.id}`}
                          className="tag-modern"
                        >
                          #{tag.name} { }
                        </Link>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="tag-more">+{event.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  <Link
                    to={`/event/${event.id}`}
                    className="event-link-modern"
                  >
                    View Details
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

              </article>
            ))}
          </div>
        )}

        <div className="section-footer">
          <Link to="/search" className="btn btn-primary">
            View All Events
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;