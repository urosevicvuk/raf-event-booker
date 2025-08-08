package rs.raf.demo.resources;

import rs.raf.demo.entities.User;
import rs.raf.demo.requests.LoginRequest;
import rs.raf.demo.services.UserService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/users")
public class UserResource {

    @Inject
    private UserService userService;

    // Authentication endpoints
    @POST
    @Path("/login")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(@Valid LoginRequest loginRequest) {
        Map<String, String> response = new HashMap<>();

        String jwt = this.userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (jwt == null) {
            response.put("message", "These credentials do not match our records");
            return Response.status(422, "Unprocessable Entity").entity(response).build();
        }

        response.put("jwt", jwt);
        return Response.ok(response).build();
    }

    // User management endpoints (Admin only)
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response all(@QueryParam("type") String userType,
                       @QueryParam("active") @DefaultValue("true") boolean activeOnly) {
        try {
            List<User> users;
            if (userType != null && !userType.trim().isEmpty()) {
                users = this.userService.findUsersByType(userType);
            } else if (activeOnly) {
                users = this.userService.findActiveUsers();
            } else {
                users = this.userService.allUsers();
            }
            
            // Remove sensitive data
            users.forEach(user -> user.setHashedPassword(null));
            
            return Response.ok(users).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving users: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid User user) {
        // Check if email already exists
        if (this.userService.existsByEmail(user.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email already exists");
            return Response.status(Response.Status.CONFLICT).entity(response).build();
        }

        try {
            User savedUser = this.userService.addUser(user);
            // Remove sensitive data from response
            savedUser.setHashedPassword(null);
            return Response.status(Response.Status.CREATED).entity(savedUser).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating user: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response find(@PathParam("id") Integer id) {
        User user = this.userService.findUser(id);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        
        // Remove sensitive data
        user.setHashedPassword(null);
        return Response.ok(user).build();
    }

    @GET
    @Path("/email/{email}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findByEmail(@PathParam("email") String email) {
        User user = this.userService.findUserByEmail(email);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        
        // Remove sensitive data
        user.setHashedPassword(null);
        return Response.ok(user).build();
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Integer id, @Valid User user) {
        if (!this.userService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        // Check if email is being changed and already exists for another user
        User existingUser = this.userService.findUser(id);
        if (!existingUser.getEmail().equals(user.getEmail()) && this.userService.existsByEmail(user.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email already exists");
            return Response.status(Response.Status.CONFLICT).entity(response).build();
        }

        try {
            user.setId(id);
            // Don't update password through this endpoint - use separate password change endpoint
            user.setHashedPassword(existingUser.getHashedPassword());
            
            User updatedUser = this.userService.updateUser(user);
            // Remove sensitive data
            updatedUser.setHashedPassword(null);
            return Response.ok(updatedUser).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating user: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") Integer id) {
        if (!this.userService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        User user = this.userService.findUser(id);
        // Prevent deletion of admin users (safety check)
        if ("admin".equals(user.getUserType())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cannot delete admin users");
            return Response.status(Response.Status.FORBIDDEN).entity(response).build();
        }

        try {
            this.userService.deleteUser(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deleted successfully");
            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting user: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    // Activate/Deactivate user endpoints
    @PUT
    @Path("/{id}/activate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response activateUser(@PathParam("id") Integer id) {
        User user = this.userService.findUser(id);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        try {
            user.setStatus("active");
            User updatedUser = this.userService.updateUser(user);
            updatedUser.setHashedPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User activated successfully");
            response.put("user", updatedUser);
            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error activating user: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    @PUT
    @Path("/{id}/deactivate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deactivateUser(@PathParam("id") Integer id) {
        User user = this.userService.findUser(id);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        // Prevent deactivation of admin users
        if ("admin".equals(user.getUserType())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cannot deactivate admin users");
            return Response.status(Response.Status.FORBIDDEN).entity(response).build();
        }

        try {
            user.setStatus("inactive");
            User updatedUser = this.userService.updateUser(user);
            updatedUser.setHashedPassword(null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User deactivated successfully");
            response.put("user", updatedUser);
            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deactivating user: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    // Password change endpoint
    @PUT
    @Path("/{id}/password")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response changePassword(@PathParam("id") Integer id, 
                                  @FormParam("newPassword") String newPassword,
                                  @FormParam("confirmPassword") String confirmPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "New password is required");
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }

        if (!newPassword.equals(confirmPassword)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password confirmation does not match");
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }

        User user = this.userService.findUser(id);
        if (user == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        try {
            user.setHashedPassword(newPassword); // Will be hashed in the service
            this.userService.updateUser(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error changing password: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }
}
