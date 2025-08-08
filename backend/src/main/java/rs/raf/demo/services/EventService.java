package rs.raf.demo.services;

import rs.raf.demo.entities.Event;
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

    public Event addEvent(Event event) {
        // Set creation time if not set
        if (event.getCreatedAt() == null) {
            event.setCreatedAt(LocalDateTime.now());
        }
        
        // Initialize counters if null
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
}