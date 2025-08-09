package rs.raf.demo.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class Event {
    private Integer id;
    
    @NotNull(message = "Title field is required")
    @NotEmpty(message = "Title field is required")
    private String title;
    
    @NotNull(message = "Description field is required")
    @NotEmpty(message = "Description field is required")
    private String description;
    
    @NotNull(message = "Creation time field is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @NotNull(message = "Event date field is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime eventDate;
    
    @NotNull(message = "Location field is required")
    @NotEmpty(message = "Location field is required")
    private String location;
    
    private Integer views = 0;
    private Integer likeCount = 0;
    private Integer dislikeCount = 0;
    
    @NotNull(message = "Author field is required")
    private Integer authorId;
    
    @NotNull(message = "Category field is required")
    private Integer categoryId;
    
    private Integer maxCapacity; // Optional - null means unlimited
    
    // These will be populated via joins/separate queries
    private User author;
    private Category category;
    private List<Tag> tags;
    private List<Comment> comments;

    public Event() {
    }

    public Event(String title, String description, LocalDateTime createdAt, LocalDateTime eventDate, 
                 String location, Integer authorId, Integer categoryId) {
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.eventDate = eventDate;
        this.location = location;
        this.authorId = authorId;
        this.categoryId = categoryId;
        this.views = 0;
        this.likeCount = 0;
        this.dislikeCount = 0;
    }

    public Event(Integer id, String title, String description, LocalDateTime createdAt, LocalDateTime eventDate, 
                 String location, Integer views, Integer likeCount, Integer dislikeCount, Integer authorId, Integer categoryId, Integer maxCapacity) {
        this(title, description, createdAt, eventDate, location, authorId, categoryId);
        this.id = id;
        this.views = views;
        this.likeCount = likeCount;
        this.dislikeCount = dislikeCount;
        this.maxCapacity = maxCapacity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
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

    public Integer getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Integer authorId) {
        this.authorId = authorId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}