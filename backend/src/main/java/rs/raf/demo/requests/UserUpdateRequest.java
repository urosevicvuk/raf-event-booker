package rs.raf.demo.requests;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class UserUpdateRequest {
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
    private String userType;

    public UserUpdateRequest() {}

    // Getters and setters
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
}