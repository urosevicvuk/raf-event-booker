package rs.raf.demo.resources;

import rs.raf.demo.entities.Event;
import rs.raf.demo.services.EventService;
import rs.raf.demo.services.TagService;
import rs.raf.demo.requests.EventUpdateRequest;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/events")
public class EventResource {

    @Inject
    private EventService eventService;

    @Inject
    private TagService tagService;

    @Context
    private HttpServletRequest request;

    // Basic CRUD for EMS
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response all() {
        List<Event> events = this.eventService.allEvents();
        // Populate events with tags for EMS
        events = this.eventService.populateEventsWithTags(events);
        return Response.ok(events).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid Event event, @QueryParam("tags") String tagsString) {
        try {
            Event savedEvent;
            if (tagsString != null && !tagsString.trim().isEmpty()) {
                savedEvent = this.eventService.addEventWithTags(event, tagsString);
            } else {
                savedEvent = this.eventService.addEvent(event);
            }
            return Response.status(Response.Status.CREATED).entity(savedEvent).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating event: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response find(@PathParam("id") Integer id) {
        Event event = this.eventService.getEventWithTags(id);
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
    public Response update(@PathParam("id") Integer id, @Valid EventUpdateRequest updateRequest) {
        if (!this.eventService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        
        try {
            // Convert EventUpdateRequest to Event entity
            Event event = new Event();
            event.setId(id);
            event.setTitle(updateRequest.getTitle());
            event.setDescription(updateRequest.getDescription());
            event.setEventDate(LocalDateTime.parse(updateRequest.getEventDate()));
            event.setLocation(updateRequest.getLocation());
            event.setCategoryId(updateRequest.getCategoryId());
            event.setMaxCapacity(updateRequest.getMaxCapacity());
            
            Event updatedEvent;
            if (updateRequest.getTags() != null && !updateRequest.getTags().trim().isEmpty()) {
                updatedEvent = this.eventService.updateEventWithTags(event, updateRequest.getTags());
            } else {
                updatedEvent = this.eventService.updateEvent(event);
                // Still need to populate tags for response
                updatedEvent = this.eventService.getEventWithTags(updatedEvent.getId());
            }
            return Response.ok(updatedEvent).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating event: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
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

    // Paginated events (for EMS and public)
    @GET
    @Path("/paginated")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPaginated(@QueryParam("page") @DefaultValue("1") int page,
                                   @QueryParam("limit") @DefaultValue("10") int limit) {
        int offset = (page - 1) * limit;
        List<Event> events = this.eventService.allEventsPaginated(offset, limit);
        
        Map<String, Object> response = new HashMap<>();
        response.put("events", events);
        response.put("page", page);
        response.put("limit", limit);
        return Response.ok(response).build();
    }

    // Search endpoints
    @GET
    @Path("/search")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchEvents(@QueryParam("q") String searchTerm,
                                @QueryParam("page") @DefaultValue("1") int page,
                                @QueryParam("limit") @DefaultValue("10") int limit) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Search term is required");
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }

        List<Event> events;
        if (page > 0 && limit > 0) {
            int offset = (page - 1) * limit;
            events = this.eventService.searchEventsByTitleOrDescriptionPaginated(searchTerm.trim(), offset, limit);
        } else {
            events = this.eventService.searchEventsByTitleOrDescription(searchTerm.trim());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("events", events);
        response.put("searchTerm", searchTerm.trim());
        response.put("page", page);
        response.put("limit", limit);
        return Response.ok(response).build();
    }

    // Filter by category
    @GET
    @Path("/category/{categoryId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEventsByCategory(@PathParam("categoryId") Integer categoryId,
                                       @QueryParam("page") @DefaultValue("1") int page,
                                       @QueryParam("limit") @DefaultValue("10") int limit) {
        List<Event> events;
        if (page > 0 && limit > 0) {
            int offset = (page - 1) * limit;
            events = this.eventService.findEventsByCategoryPaginated(categoryId, offset, limit);
        } else {
            events = this.eventService.findEventsByCategory(categoryId);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("events", events);
        response.put("categoryId", categoryId);
        response.put("page", page);
        response.put("limit", limit);
        return Response.ok(response).build();
    }

    // Filter by tag
    @GET
    @Path("/tag/{tagId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEventsByTag(@PathParam("tagId") Integer tagId,
                                  @QueryParam("page") @DefaultValue("1") int page,
                                  @QueryParam("limit") @DefaultValue("10") int limit) {
        List<Event> events;
        if (page > 0 && limit > 0) {
            int offset = (page - 1) * limit;
            events = this.eventService.findEventsByTagPaginated(tagId, offset, limit);
        } else {
            events = this.eventService.findEventsByTag(tagId);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("events", events);
        response.put("tagId", tagId);
        response.put("page", page);
        response.put("limit", limit);
        return Response.ok(response).build();
    }

    // Filter by author (for EMS - my events)
    @GET
    @Path("/author/{authorId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEventsByAuthor(@PathParam("authorId") Integer authorId) {
        List<Event> events = this.eventService.findEventsByAuthor(authorId);
        return Response.ok(events).build();
    }

    // Public platform endpoints
    @GET
    @Path("/latest")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLatestEvents(@QueryParam("limit") @DefaultValue("10") int limit) {
        List<Event> events = this.eventService.findLatestEvents(limit);
        return Response.ok(events).build();
    }

    @GET
    @Path("/most-visited")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMostVisitedEvents(@QueryParam("limit") @DefaultValue("10") int limit) {
        List<Event> events = this.eventService.findMostVisitedEvents(limit);
        return Response.ok(events).build();
    }

    @GET
    @Path("/most-visited-30days")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMostVisitedEventsLast30Days(@QueryParam("limit") @DefaultValue("10") int limit) {
        List<Event> events = this.eventService.findMostVisitedEventsLast30Days(limit);
        return Response.ok(events).build();
    }

    @GET
    @Path("/most-reacted")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMostReactedEvents(@QueryParam("limit") @DefaultValue("3") int limit) {
        List<Event> events = this.eventService.findMostReactedEvents(limit);
        return Response.ok(events).build();
    }

    @GET
    @Path("/{id}/similar")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSimilarEvents(@PathParam("id") Integer eventId,
                                    @QueryParam("limit") @DefaultValue("3") int limit) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        List<Event> events = this.eventService.findSimilarEvents(eventId, limit);
        return Response.ok(events).build();
    }

    // View tracking endpoint
    @POST
    @Path("/{id}/view")
    @Produces(MediaType.APPLICATION_JSON)
    public Response incrementView(@PathParam("id") Integer eventId) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        HttpSession session = request.getSession();
        String viewedKey = "viewed_event_" + eventId;
        
        if (session.getAttribute(viewedKey) == null) {
            this.eventService.incrementViews(eventId);
            session.setAttribute(viewedKey, true);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "View counted");
            return Response.ok(response).build();
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Already viewed in this session");
            return Response.ok(response).build();
        }
    }

    // Like/dislike endpoints for events
    @POST
    @Path("/{id}/like")
    @Produces(MediaType.APPLICATION_JSON)
    public Response likeEvent(@PathParam("id") Integer eventId) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        HttpSession session = request.getSession();
        String likedKey = "liked_event_" + eventId;
        String dislikedKey = "disliked_event_" + eventId;
        
        Boolean hasLiked = (Boolean) session.getAttribute(likedKey);
        Boolean hasDisliked = (Boolean) session.getAttribute(dislikedKey);
        
        Map<String, Object> response = new HashMap<>();
        
        if (Boolean.TRUE.equals(hasLiked)) {
            // Unlike - remove like
            this.eventService.decrementLikes(eventId);
            session.removeAttribute(likedKey);
            response.put("message", "Like removed");
            response.put("action", "unliked");
            response.put("hasLiked", false);
            response.put("hasDisliked", Boolean.TRUE.equals(hasDisliked));
        } else {
            // Add like
            if (Boolean.TRUE.equals(hasDisliked)) {
                // Remove dislike first
                this.eventService.decrementDislikes(eventId);
                session.removeAttribute(dislikedKey);
            }
            this.eventService.incrementLikes(eventId);
            session.setAttribute(likedKey, true);
            response.put("message", "Event liked");
            response.put("action", "liked");
            response.put("hasLiked", true);
            response.put("hasDisliked", false); // Always false after liking
        }
        
        // Add current event stats for frontend to update
        Event currentEvent = this.eventService.findEvent(eventId);
        response.put("likeCount", currentEvent.getLikeCount());
        response.put("dislikeCount", currentEvent.getDislikeCount());
        
        return Response.ok(response).build();
    }

    @POST
    @Path("/{id}/dislike")
    @Produces(MediaType.APPLICATION_JSON)
    public Response dislikeEvent(@PathParam("id") Integer eventId) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        HttpSession session = request.getSession();
        String likedKey = "liked_event_" + eventId;
        String dislikedKey = "disliked_event_" + eventId;
        
        Boolean hasLiked = (Boolean) session.getAttribute(likedKey);
        Boolean hasDisliked = (Boolean) session.getAttribute(dislikedKey);
        
        Map<String, Object> response = new HashMap<>();
        
        if (Boolean.TRUE.equals(hasDisliked)) {
            // Remove dislike
            this.eventService.decrementDislikes(eventId);
            session.removeAttribute(dislikedKey);
            response.put("message", "Dislike removed");
            response.put("action", "undisliked");
            response.put("hasDisliked", false);
            response.put("hasLiked", Boolean.TRUE.equals(hasLiked));
        } else {
            // Add dislike
            if (Boolean.TRUE.equals(hasLiked)) {
                // Remove like first
                this.eventService.decrementLikes(eventId);
                session.removeAttribute(likedKey);
            }
            this.eventService.incrementDislikes(eventId);
            session.setAttribute(dislikedKey, true);
            response.put("message", "Event disliked");
            response.put("action", "disliked");
            response.put("hasDisliked", true);
            response.put("hasLiked", false); // Always false after disliking
        }
        
        // Add current event stats for frontend to update
        Event currentEvent = this.eventService.findEvent(eventId);
        response.put("likeCount", currentEvent.getLikeCount());
        response.put("dislikeCount", currentEvent.getDislikeCount());
        
        return Response.ok(response).build();
    }

    // Get current RSVP count for an event
    @GET
    @Path("/{id}/rsvp-count")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRSVPCount(@PathParam("id") Integer eventId) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        int currentCount = this.eventService.getCurrentRSVPCount(eventId);
        Map<String, Object> response = new HashMap<>();
        response.put("eventId", eventId);
        response.put("currentRSVPCount", currentCount);
        return Response.ok(response).build();
    }
}