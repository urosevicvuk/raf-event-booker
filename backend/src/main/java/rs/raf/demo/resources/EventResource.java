package rs.raf.demo.resources;

import rs.raf.demo.entities.Event;
import rs.raf.demo.services.EventService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/events")
public class EventResource {

    @Inject
    private EventService eventService;

    // Basic CRUD for EMS
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response all() {
        List<Event> events = this.eventService.allEvents();
        return Response.ok(events).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid Event event) {
        Event savedEvent = this.eventService.addEvent(event);
        return Response.status(Response.Status.CREATED).entity(savedEvent).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response find(@PathParam("id") Integer id) {
        Event event = this.eventService.findEvent(id);
        if (event == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        return Response.ok(event).build();
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Integer id, @Valid Event event) {
        if (!this.eventService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        event.setId(id);
        Event updatedEvent = this.eventService.updateEvent(event);
        return Response.ok(updatedEvent).build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") Integer id) {
        if (!this.eventService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        this.eventService.deleteEvent(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Event deleted successfully");
        return Response.ok(response).build();
    }
}