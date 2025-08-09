package rs.raf.demo.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class RSVP {
    private Integer id;
    
    @NotNull(message = "User identifier field is required")
    @NotEmpty(message = "User identifier field is required")
    private String userIdentifier; // Can be ID or email
    
    @NotNull(message = "Event ID field is required")
    private Integer eventId;
    
    @NotNull(message = "Registration date field is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registrationDate;

    public RSVP() {
    }

    public RSVP(String userIdentifier, Integer eventId, LocalDateTime registrationDate) {
        this.userIdentifier = userIdentifier;
        this.eventId = eventId;
        this.registrationDate = registrationDate;
    }

    public RSVP(Integer id, String userIdentifier, Integer eventId, LocalDateTime registrationDate) {
        this(userIdentifier, eventId, registrationDate);
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserIdentifier() {
        return userIdentifier;
    }

    public void setUserIdentifier(String userIdentifier) {
        this.userIdentifier = userIdentifier;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }
}