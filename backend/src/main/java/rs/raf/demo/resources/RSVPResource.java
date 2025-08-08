package rs.raf.demo.resources;

import rs.raf.demo.entities.RSVP;
import rs.raf.demo.services.RSVPService;
import rs.raf.demo.services.EventService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.HashMap;
import java.util.Map;

@Path("/rsvp")
public class RSVPResource {

    @Inject
    private RSVPService rsvpService;

    @Inject
    private EventService eventService;

    // Register for event (for public platform)
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid RSVP rsvp) {
        if (!this.eventService.existsById(rsvp.getEventId())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
        RSVP savedRSVP = this.rsvpService.addRSVP(rsvp);
        return Response.status(Response.Status.CREATED).entity(savedRSVP).build();
    }

    // Cancel registration
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") Integer id) {
        if (!this.rsvpService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "RSVP not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        this.rsvpService.deleteRSVP(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "RSVP cancelled successfully");
        return Response.ok(response).build();
    }

    // Get RSVP count for event (to display "X registered" and check capacity)
    @GET
    @Path("/event/{eventId}/count")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRSVPCount(@PathParam("eventId") Integer eventId) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        int count = this.rsvpService.getRSVPCount(eventId);
        Map<String, Integer> response = new HashMap<>();
        response.put("count", count);
        return Response.ok(response).build();
    }
}