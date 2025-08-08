package rs.raf.demo.repositories.event;

import rs.raf.demo.entities.Event;

import java.util.List;

public interface EventRepository {
    public Event addEvent(Event event);
    public List<Event> allEvents();
    public List<Event> allEventsPaginated(int offset, int limit);
    public Event findEvent(Integer id);
    public Event updateEvent(Event event);
    public void deleteEvent(Integer id);
    public boolean existsById(Integer id);
    
    // Search and filter methods
    public List<Event> searchEventsByTitleOrDescription(String searchTerm);
    public List<Event> searchEventsByTitleOrDescriptionPaginated(String searchTerm, int offset, int limit);
    public List<Event> findEventsByCategory(Integer categoryId);
    public List<Event> findEventsByCategoryPaginated(Integer categoryId, int offset, int limit);
    public List<Event> findEventsByTag(Integer tagId);
    public List<Event> findEventsByTagPaginated(Integer tagId, int offset, int limit);
    public List<Event> findEventsByAuthor(Integer authorId);
    
    // Home page and most visited methods
    public List<Event> findLatestEvents(int limit);
    public List<Event> findMostVisitedEvents(int limit);
    public List<Event> findMostVisitedEventsLast30Days(int limit);
    public List<Event> findMostReactedEvents(int limit);
    public List<Event> findSimilarEvents(Integer eventId, int limit);
    
    // View and reaction methods
    public void incrementViews(Integer eventId);
    public void incrementLikes(Integer eventId);
    public void incrementDislikes(Integer eventId);
    public void decrementLikes(Integer eventId);
    public void decrementDislikes(Integer eventId);
    
    // Capacity and RSVP related
    public int getCurrentRSVPCount(Integer eventId);
}
