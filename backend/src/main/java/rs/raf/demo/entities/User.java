package rs.raf.demo.entities;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Email;

public class User {
    private Integer id;
    
    @NotNull(message = "Email field is required")
    @NotEmpty(message = "Email field is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotNull(message = "First name field is required")
    @NotEmpty(message = "First name field is required")
    private String firstName;
    
    @NotNull(message = "Last name field is required")
    @NotEmpty(message = "Last name field is required")
    private String lastName;
    
    @NotNull(message = "User type field is required")
    @NotEmpty(message = "User type field is required")
    private String userType; // "event creator" or "admin"
    
    @NotNull(message = "Status field is required")
    @NotEmpty(message = "Status field is required")
    private String status; // "active" or "inactive"
    
    @NotNull(message = "Password field is required")
    @NotEmpty(message = "Password field is required")
    private String hashedPassword;

    public User() {
    }

    public User(String email, String firstName, String lastName, String userType, String status, String hashedPassword) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userType = userType;
        this.status = status;
        this.hashedPassword = hashedPassword;
    }

    public User(Integer id, String email, String firstName, String lastName, String userType, String status, String hashedPassword) {
        this(email, firstName, lastName, userType, status, hashedPassword);
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }
}
