package rs.raf.demo.resources;

import rs.raf.demo.entities.Tag;
import rs.raf.demo.entities.Event;
import rs.raf.demo.services.TagService;
import rs.raf.demo.services.EventService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/tags")
public class TagResource {

    @Inject
    private TagService tagService;
    
    @Inject
    private EventService eventService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Tag> all() {
        return this.tagService.allTags();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid Tag tag) {
        Tag savedTag = this.tagService.addTag(tag);
        return Response.status(Response.Status.CREATED).entity(savedTag).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findTag(@PathParam("id") Integer id) {
        Tag tag = this.tagService.findTag(id);
        if (tag == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tag not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        return Response.ok(tag).build();
    }

    @GET
    @Path("/{id}/events")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEventsByTag(@PathParam("id") Integer tagId,
                                  @QueryParam("page") @DefaultValue("1") int page,
                                  @QueryParam("limit") @DefaultValue("10") int limit) {
        Tag tag = this.tagService.findTag(tagId);
        if (tag == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tag not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        try {
            int offset = (page - 1) * limit;
            List<Event> events = this.eventService.findEventsByTagPaginated(tagId, offset, limit);
            // Populate events with their tags
            events = this.eventService.populateEventsWithTags(events);
            
            Map<String, Object> response = new HashMap<>();
            response.put("events", events);
            response.put("page", page);
            response.put("limit", limit);
            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error fetching events: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    @GET
    @Path("/event/{eventId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTagsForEvent(@PathParam("eventId") Integer eventId) {
        List<Tag> tags = this.tagService.getTagsForEvent(eventId);
        return Response.ok(tags).build();
    }
}