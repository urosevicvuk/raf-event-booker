package rs.raf.demo.resources;

import rs.raf.demo.entities.Comment;
import rs.raf.demo.services.CommentService;
import rs.raf.demo.services.EventService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/comments")
public class CommentResource {

    @Inject
    private CommentService commentService;

    @Inject
    private EventService eventService;

    // Create comment (for public platform)
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid Comment comment) {
        if (!this.eventService.existsById(comment.getEventId())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
        Comment savedComment = this.commentService.addComment(comment);
        return Response.status(Response.Status.CREATED).entity(savedComment).build();
    }

    // Get comments for an event (for event detail page)
    @GET
    @Path("/event/{eventId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommentsByEvent(@PathParam("eventId") Integer eventId) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        List<Comment> comments = this.commentService.findCommentsByEventId(eventId);
        return Response.ok(comments).build();
    }

    // Like/dislike comments (for public platform)
    @POST
    @Path("/{id}/like")
    @Produces(MediaType.APPLICATION_JSON)
    public Response likeComment(@PathParam("id") Integer id) {
        if (!this.commentService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        this.commentService.likeComment(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Comment liked successfully");
        return Response.ok(response).build();
    }

    @POST
    @Path("/{id}/dislike")
    @Produces(MediaType.APPLICATION_JSON)
    public Response dislikeComment(@PathParam("id") Integer id) {
        if (!this.commentService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        this.commentService.dislikeComment(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Comment disliked successfully");
        return Response.ok(response).build();
    }
}