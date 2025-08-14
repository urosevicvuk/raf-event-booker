package rs.raf.demo.resources;

import rs.raf.demo.entities.Event;
import rs.raf.demo.entities.RSVP;
import rs.raf.demo.services.RSVPService;
import rs.raf.demo.services.EventService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/rsvp")
public class RSVPResource {

    @Inject
    private RSVPService rsvpService;

    @Inject
    private EventService eventService;

    // Register for event with capacity checking (for public platform)
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid RSVP rsvp) {
        // Check if event exists
        Event event = this.eventService.findEvent(rsvp.getEventId());
        if (event == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }

        // Check if user is already registered
        if (this.rsvpService.isUserRegistered(rsvp.getUserIdentifier(), rsvp.getEventId())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "User is already registered for this event");
            return Response.status(Response.Status.CONFLICT).entity(response).build();
        }

        // Check capacity if max capacity is set
        if (event.getMaxCapacity() != null && event.getMaxCapacity() > 0) {
            int currentCount = this.rsvpService.getRSVPCount(rsvp.getEventId());
            if (currentCount >= event.getMaxCapacity()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Event is full - maximum capacity reached");
                return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
            }
        }

        // Add RSVP
        try {
            RSVP savedRSVP = this.rsvpService.addRSVP(rsvp);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully registered for event");
            response.put("rsvp", savedRSVP);
            return Response.status(Response.Status.CREATED).entity(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to register for event: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    // Get RSVP status and count for event (to display "X/max registered" and check capacity)
    @GET
    @Path("/event/{eventId}/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEventRSVPStatus(@PathParam("eventId") Integer eventId) {
        Event event = this.eventService.findEvent(eventId);
        if (event == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        int currentCount = this.rsvpService.getRSVPCount(eventId);
        Map<String, Object> response = new HashMap<>();
        response.put("eventId", eventId);
        response.put("currentCount", currentCount);
        response.put("maxCapacity", event.getMaxCapacity());
        response.put("canRegister", event.getMaxCapacity() == null || currentCount < event.getMaxCapacity());
        response.put("isFull", event.getMaxCapacity() != null && currentCount >= event.getMaxCapacity());
        response.put("hasCapacityLimit", event.getMaxCapacity() != null && event.getMaxCapacity() > 0);
        
        return Response.ok(response).build();
    }

    // Alternative endpoint path that frontend expects
    @GET
    @Path("/status/{eventId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRSVPStatus(@PathParam("eventId") Integer eventId) {
        return getEventRSVPStatus(eventId);
    }

    // Check if a user is registered for an event
    @GET
    @Path("/event/{eventId}/user/{userIdentifier}/status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserRSVPStatus(@PathParam("eventId") Integer eventId,
                                     @PathParam("userIdentifier") String userIdentifier) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        boolean isRegistered = this.rsvpService.isUserRegistered(userIdentifier, eventId);
        Map<String, Object> response = new HashMap<>();
        response.put("eventId", eventId);
        response.put("userIdentifier", userIdentifier);
        response.put("isRegistered", isRegistered);
        
        return Response.ok(response).build();
    }

    // Get all RSVPs for an event (for event management)
    @GET
    @Path("/event/{eventId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEventRSVPs(@PathParam("eventId") Integer eventId,
                                 @QueryParam("page") @DefaultValue("1") int page,
                                 @QueryParam("limit") @DefaultValue("20") int limit) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        List<RSVP> rsvps;
        if (page > 0 && limit > 0) {
            int offset = (page - 1) * limit;
            rsvps = this.rsvpService.findRSVPsByEventIdPaginated(eventId, offset, limit);
        } else {
            rsvps = this.rsvpService.findRSVPsByEventId(eventId);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("rsvps", rsvps);
        response.put("eventId", eventId);
        response.put("page", page);
        response.put("limit", limit);
        
        return Response.ok(response).build();
    }
}