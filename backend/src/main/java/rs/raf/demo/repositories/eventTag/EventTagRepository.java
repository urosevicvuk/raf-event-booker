package rs.raf.demo.repositories.eventTag;

import rs.raf.demo.entities.EventTag;
import java.util.List;

public interface EventTagRepository {
    public void addEventTag(Integer eventId, Integer tagId);
    public void removeEventTag(Integer eventId, Integer tagId);
    public void removeAllTagsForEvent(Integer eventId);
    public boolean eventHasTag(Integer eventId, Integer tagId);
}
