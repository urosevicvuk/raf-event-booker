package rs.raf.demo.repositories.rsvp;

import rs.raf.demo.entities.RSVP;

import java.util.List;

public interface RSVPRepository {
    public RSVP addRSVP(RSVP rsvp);
    public List<RSVP> allRSVPs();
    public RSVP findRSVP(Integer id);
    public List<RSVP> findRSVPsByEventId(Integer eventId);

    boolean existsByEventAndUser(Integer eventId, String userIdentifier);

    public List<RSVP> findRSVPsByEventIdPaginated(Integer eventId, int offset, int limit);
    public List<RSVP> findRSVPsByUserIdentifier(String userIdentifier);
    public RSVP findRSVPByEventAndUser(Integer eventId, String userIdentifier);
    public void deleteRSVP(Integer id);
    public void deleteRSVPByUserAndEvent(String userIdentifier, Integer eventId);
    public void deleteRSVPsByEventId(Integer eventId);
    public boolean existsById(Integer id);
    public boolean isUserRegistered(String userIdentifier, Integer eventId);
    public int countRSVPsByEventId(Integer eventId);
}
