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

    public List<RSVP> allRSVPs() {
        return this.rsvpRepository.allRSVPs();
    }

    public RSVP findRSVP(Integer id) {
        return this.rsvpRepository.findRSVP(id);
    }

    public void deleteRSVP(Integer id) {
        this.rsvpRepository.deleteRSVP(id);
    }

    public boolean existsById(Integer id) {
        return this.rsvpRepository.existsById(id);
    }

    // Basic count method (using existing repository methods)
    public int getRSVPCount(Integer eventId) {
        // Simple count by getting all RSVPs and filtering by eventId
        List<RSVP> allRSVPs = this.rsvpRepository.allRSVPs();
        return (int) allRSVPs.stream()
                .filter(rsvp -> rsvp.getEventId().equals(eventId))
                .count();
    }
}