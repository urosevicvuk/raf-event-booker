package rs.raf.demo.entities;

import javax.validation.constraints.NotNull;

public class EventTag {
    private Integer id;
    
    @NotNull(message = "Event ID field is required")
    private Integer eventId;
    
    @NotNull(message = "Tag ID field is required")
    private Integer tagId;

    public EventTag() {
    }

    public EventTag(Integer eventId, Integer tagId) {
        this.eventId = eventId;
        this.tagId = tagId;
    }

    public EventTag(Integer id, Integer eventId, Integer tagId) {
        this(eventId, tagId);
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public Integer getTagId() {
        return tagId;
    }

    public void setTagId(Integer tagId) {
        this.tagId = tagId;
    }
}