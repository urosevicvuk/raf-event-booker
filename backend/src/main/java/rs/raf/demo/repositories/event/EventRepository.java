package rs.raf.demo.repositories.event;

import rs.raf.demo.entities.Event;

import java.util.List;

public interface EventRepository {
    Event addEvent(Event event);
    List<Event> allEvents();
    List<Event> allEventsPaginated(int offset, int limit);
    Event findEvent(Integer id);
    Event updateEvent(Event event);
    void deleteEvent(Integer id);
    boolean existsById(Integer id);
    
    // Search and filter methods
    List<Event> searchEventsByTitleOrDescription(String searchTerm);
    List<Event> searchEventsByTitleOrDescriptionPaginated(String searchTerm, int offset, int limit);
    List<Event> findEventsByCategory(Integer categoryId);
    List<Event> findEventsByCategoryPaginated(Integer categoryId, int offset, int limit);
    List<Event> findEventsByTag(Integer tagId);
    List<Event> findEventsByTagPaginated(Integer tagId, int offset, int limit);
    List<Event> findEventsByAuthor(Integer authorId);
    
    // Home page and most visited methods
    List<Event> findLatestEvents(int limit);
    List<Event> findMostVisitedEvents(int limit);
    List<Event> findMostVisitedEventsLast30Days(int limit);
    List<Event> findMostReactedEvents(int limit);
    List<Event> findSimilarEvents(Integer eventId, int limit);
    
    // View and reaction methods
    void incrementViews(Integer eventId);
    void incrementLikes(Integer eventId);
    void incrementDislikes(Integer eventId);
    void decrementLikes(Integer eventId);
    void decrementDislikes(Integer eventId);

    int eventCount();
    
    // Capacity and RSVP related
    int getCurrentRSVPCount(Integer eventId);
}
