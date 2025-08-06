package rs.raf.demo.entities;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class Comment {
    private Integer id;
    
    @NotNull(message = "Author name field is required")
    @NotEmpty(message = "Author name field is required")
    private String authorName;
    
    @NotNull(message = "Comment text field is required")
    @NotEmpty(message = "Comment text field is required")
    private String text;
    
    @NotNull(message = "Creation date field is required")
    private LocalDateTime createdAt;
    
    @NotNull(message = "Event ID field is required")
    private Integer eventId;
    
    private Integer likeCount = 0;
    private Integer dislikeCount = 0;

    public Comment() {
    }

    public Comment(String authorName, String text, LocalDateTime createdAt, Integer eventId) {
        this.authorName = authorName;
        this.text = text;
        this.createdAt = createdAt;
        this.eventId = eventId;
        this.likeCount = 0;
        this.dislikeCount = 0;
    }

    public Comment(Integer id, String authorName, String text, LocalDateTime createdAt, Integer eventId, 
                   Integer likeCount, Integer dislikeCount) {
        this(authorName, text, createdAt, eventId);
        this.id = id;
        this.likeCount = likeCount;
        this.dislikeCount = dislikeCount;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Integer getDislikeCount() {
        return dislikeCount;
    }

    public void setDislikeCount(Integer dislikeCount) {
        this.dislikeCount = dislikeCount;
    }
}