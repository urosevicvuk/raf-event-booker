package rs.raf.demo.requests;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EventUpdateRequest {
    @NotNull(message = "Title field is required")
    @NotEmpty(message = "Title field is required")
    private String title;
    
    @NotNull(message = "Description field is required") 
    @NotEmpty(message = "Description field is required")
    private String description;
    
    @NotNull(message = "Event date field is required")
    private String eventDate;
    
    @NotNull(message = "Location field is required")
    @NotEmpty(message = "Location field is required")
    private String location;
    
    @NotNull(message = "Category ID field is required")
    private Integer categoryId;
    
    private String tags;
    
    private Integer maxCapacity;

    public EventUpdateRequest() {}

    // Getters and setters
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

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
}