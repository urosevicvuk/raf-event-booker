package rs.raf.demo.services;

import rs.raf.demo.entities.Category;
import rs.raf.demo.entities.Event;
import rs.raf.demo.entities.Tag;
import rs.raf.demo.entities.User;
import rs.raf.demo.repositories.event.EventRepository;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

public class EventService {

    public EventService() {
        System.out.println(this);
    }

    @Inject
    private EventRepository eventRepository;
    
    @Inject
    private TagService tagService;
    
    @Inject
    private CategoryService categoryService;
    
    @Inject
    private UserService userService;

    public Event addEvent(Event event) {
        if (event.getCreatedAt() == null) {
            event.setCreatedAt(LocalDateTime.now());
        }
        
        if (event.getViews() == null) {
            event.setViews(0);
        }
        if (event.getLikeCount() == null) {
            event.setLikeCount(0);
        }
        if (event.getDislikeCount() == null) {
            event.setDislikeCount(0);
        }
        
        return this.eventRepository.addEvent(event);
    }

    public List<Event> allEvents() {
        return this.eventRepository.allEvents();
    }

    public Event findEvent(Integer id) {
        return this.eventRepository.findEvent(id);
    }

    public Event updateEvent(Event event) {
        return this.eventRepository.updateEvent(event);
    }

    public void deleteEvent(Integer id) {
        this.eventRepository.deleteEvent(id);
    }

    public boolean existsById(Integer id) {
        return this.eventRepository.existsById(id);
    }

    public List<Event> allEventsPaginated(int offset, int limit) {
        return this.eventRepository.allEventsPaginated(offset, limit);
    }

    public List<Event> searchEventsByTitleOrDescription(String searchTerm) {
        return this.eventRepository.searchEventsByTitleOrDescription(searchTerm);
    }

    public List<Event> searchEventsByTitleOrDescriptionPaginated(String searchTerm, int offset, int limit) {
        return this.eventRepository.searchEventsByTitleOrDescriptionPaginated(searchTerm, offset, limit);
    }

    public List<Event> findEventsByCategory(Integer categoryId) {
        return this.eventRepository.findEventsByCategory(categoryId);
    }

    public List<Event> findEventsByCategoryPaginated(Integer categoryId, int offset, int limit) {
        return this.eventRepository.findEventsByCategoryPaginated(categoryId, offset, limit);
    }

    public List<Event> findEventsByTag(Integer tagId) {
        return this.eventRepository.findEventsByTag(tagId);
    }

    public List<Event> findEventsByTagPaginated(Integer tagId, int offset, int limit) {
        return this.eventRepository.findEventsByTagPaginated(tagId, offset, limit);
    }

    public List<Event> findEventsByAuthor(Integer authorId) {
        return this.eventRepository.findEventsByAuthor(authorId);
    }

    public List<Event> findLatestEvents(int limit) {
        return this.eventRepository.findLatestEvents(limit);
    }

    public List<Event> findMostVisitedEvents(int limit) {
        return this.eventRepository.findMostVisitedEvents(limit);
    }

    public List<Event> findMostVisitedEventsLast30Days(int limit) {
        return this.eventRepository.findMostVisitedEventsLast30Days(limit);
    }

    public List<Event> findMostReactedEvents(int limit) {
        return this.eventRepository.findMostReactedEvents(limit);
    }

    public List<Event> findSimilarEvents(Integer eventId, int limit) {
        return this.eventRepository.findSimilarEvents(eventId, limit);
    }

    public void incrementViews(Integer eventId) {
        this.eventRepository.incrementViews(eventId);
    }

    public void incrementLikes(Integer eventId) {
        this.eventRepository.incrementLikes(eventId);
    }

    public void incrementDislikes(Integer eventId) {
        this.eventRepository.incrementDislikes(eventId);
    }

    public void decrementLikes(Integer eventId) {
        this.eventRepository.decrementLikes(eventId);
    }

    public void decrementDislikes(Integer eventId) {
        this.eventRepository.decrementDislikes(eventId);
    }

    public int getCurrentRSVPCount(Integer eventId) {
        return this.eventRepository.getCurrentRSVPCount(eventId);
    }

    public Event addEventWithTags(Event event, String tagsString) {
        Event savedEvent = this.addEvent(event);
        
        if (tagsString != null && !tagsString.trim().isEmpty()) {
            List<Tag> tags = this.tagService.findOrCreateTags(tagsString);
            this.tagService.assignTagsToEvent(savedEvent.getId(), tags);
        }
        
        return this.getEventWithTags(savedEvent.getId());
    }

    public Event updateEventWithTags(Event event, String tagsString) {
        Event updatedEvent = this.updateEvent(event);
        
        if (tagsString != null) {
            if (tagsString.trim().isEmpty()) {
                this.tagService.assignTagsToEvent(event.getId(), new java.util.ArrayList<>());
            } else {
                List<Tag> tags = this.tagService.findOrCreateTags(tagsString);
                this.tagService.assignTagsToEvent(event.getId(), tags);
            }
        }
        
        return this.getEventWithTags(event.getId());
    }

    public Event getEventWithTags(Integer eventId) {
        Event event = this.findEvent(eventId);
        if (event != null) {
            List<Tag> tags = this.tagService.getTagsForEvent(eventId);
            event.setTags(tags);
        }
        return event;
    }

    public int eventCount() {
        return this.eventRepository.eventCount();
    }

    public List<Event> populateEventsWithTags(List<Event> events) {
        for (Event event : events) {
            List<Tag> tags = this.tagService.getTagsForEvent(event.getId());
            event.setTags(tags);
        }
        return events;
    }
    
    public Event populateEventWithCompleteData(Event event) {
        if (event == null) return null;
        
        if (event.getCategoryId() != null) {
            Category category = this.categoryService.findCategory(event.getCategoryId());
            event.setCategory(category);
        }
        
        if (event.getAuthorId() != null) {
            User author = this.userService.findUser(event.getAuthorId());
            event.setAuthor(author);
        }
        
        List<Tag> tags = this.tagService.getTagsForEvent(event.getId());
        event.setTags(tags);
        
        return event;
    }
    
    public List<Event> populateEventsWithCompleteData(List<Event> events) {
        for (Event event : events) {
            populateEventWithCompleteData(event);
        }
        return events;
    }
}