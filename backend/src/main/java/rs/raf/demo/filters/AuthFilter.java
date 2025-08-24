package rs.raf.demo.filters;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import rs.raf.demo.resources.*;
import rs.raf.demo.services.UserService;
import rs.raf.demo.entities.User;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Provider
public class AuthFilter implements ContainerRequestFilter {

    @Inject
    UserService userService;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {

        if (!this.isAuthRequired(requestContext)) {
            return;
        }

        try {
            String token = requestContext.getHeaderString("Authorization");
            if(token != null && token.startsWith("Bearer ")) {
                token = token.replace("Bearer ", "");
            }

            User currentUser = this.validateTokenAndGetUser(token);
            if (currentUser == null) {
                requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
                return;
            }

            if (!"active".equals(currentUser.getStatus())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User account is inactive");
                requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).entity(response).build());
                return;
            }

            requestContext.setProperty("currentUser", currentUser);

            if (this.requiresAdminAccess(requestContext)) {
                if (!"admin".equals(currentUser.getUserType())) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Admin access required");
                    requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).entity(response).build());
                    return;
                }
            }

        } catch (Exception exception) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
        }
    }

    private User validateTokenAndGetUser(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256("secret");
            DecodedJWT jwt = JWT.require(algorithm).build().verify(token);
            
            String email = jwt.getSubject();
            User user = this.userService.findUserByEmail(email);
            
            return user;
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isAuthRequired(ContainerRequestContext req) {
        String path = req.getUriInfo().getPath();
        String method = req.getMethod();

        if (path.contains("login")) {
            return false;
        }

        List<Object> matchedResources = req.getUriInfo().getMatchedResources();
        for (Object matchedResource : matchedResources) {
            
            if (matchedResource instanceof UserResource) {
                return true;
            }
            
            if (matchedResource instanceof CategoryResource) {
                return method.equals("POST") || method.equals("PUT") || method.equals("DELETE");
            }
            
            if (matchedResource instanceof EventResource) {
                return method.equals("POST") || method.equals("PUT") || method.equals("DELETE");
            }
            
        }

        return false;
    }

    private boolean requiresAdminAccess(ContainerRequestContext req) {
        List<Object> matchedResources = req.getUriInfo().getMatchedResources();
        for (Object matchedResource : matchedResources) {
            if (matchedResource instanceof UserResource) {
                return true;
            }
        }
        return false;
    }
}
