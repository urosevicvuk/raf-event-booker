package rs.raf.demo.services;

import rs.raf.demo.entities.RSVP;
import rs.raf.demo.entities.Event;
import rs.raf.demo.repositories.rsvp.RSVPRepository;
import rs.raf.demo.repositories.event.EventRepository;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

public class RSVPService {

    public RSVPService() {
        System.out.println(this);
    }

    @Inject
    private RSVPRepository rsvpRepository;

    @Inject
    private EventRepository eventRepository;

    public RSVP addRSVP(RSVP rsvp) {
        // Set registration date if not set
        if (rsvp.getRegistrationDate() == null) {
            rsvp.setRegistrationDate(LocalDateTime.now());
        }
        
        return this.rsvpRepository.addRSVP(rsvp);
    }

    public boolean existsById(Integer id) {
        return this.rsvpRepository.existsById(id);
    }

    // Enhanced RSVP methods
    public int getRSVPCount(Integer eventId) {
        return this.rsvpRepository.countRSVPsByEventId(eventId);
    }

    public List<RSVP> findRSVPsByEventId(Integer eventId) {
        return this.rsvpRepository.findRSVPsByEventId(eventId);
    }

    public List<RSVP> findRSVPsByEventIdPaginated(Integer eventId, int offset, int limit) {
        return this.rsvpRepository.findRSVPsByEventIdPaginated(eventId, offset, limit);
    }

    public boolean isUserRegistered(String userIdentifier, Integer eventId) {
        return this.rsvpRepository.isUserRegistered(userIdentifier, eventId);
    }

}