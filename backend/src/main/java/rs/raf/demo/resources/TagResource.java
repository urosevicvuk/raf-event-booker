package rs.raf.demo.resources;

import rs.raf.demo.entities.Tag;
import rs.raf.demo.services.TagService;

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

    // Basic CRUD for EMS
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

    // Get tags for an event (for event detail page)
    @GET
    @Path("/event/{eventId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTagsForEvent(@PathParam("eventId") Integer eventId) {
        List<Tag> tags = this.tagService.getTagsForEvent(eventId);
        return Response.ok(tags).build();
    }
}