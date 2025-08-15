package rs.raf.demo.requests;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class CommentCreateRequest {
    @NotNull(message = "Author name field is required")
    @NotEmpty(message = "Author name field is required")
    private String authorName;
    
    @NotNull(message = "Comment text field is required")
    @NotEmpty(message = "Comment text field is required")
    private String text;
    
    @NotNull(message = "Event ID field is required")
    private Integer eventId;

    public CommentCreateRequest() {
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }
}