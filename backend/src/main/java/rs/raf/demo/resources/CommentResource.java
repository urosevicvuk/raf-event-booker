package rs.raf.demo.resources;

import rs.raf.demo.entities.Comment;
import rs.raf.demo.requests.CommentCreateRequest;
import rs.raf.demo.services.CommentService;
import rs.raf.demo.services.EventService;

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

@Path("/comments")
public class CommentResource {

    @Inject
    private CommentService commentService;

    @Inject
    private EventService eventService;

    @Context
    private HttpServletRequest request;

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid CommentCreateRequest createRequest) {
        if (!this.eventService.existsById(createRequest.getEventId())) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
        
        Comment comment = new Comment();
        comment.setAuthorName(createRequest.getAuthorName());
        comment.setText(createRequest.getText());
        comment.setEventId(createRequest.getEventId());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setLikeCount(0);
        comment.setDislikeCount(0);
        
        Comment savedComment = this.commentService.addComment(comment);
        return Response.status(Response.Status.CREATED).entity(savedComment).build();
    }

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

    @GET
    @Path("/event/{eventId}/paginated")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommentsByEventPaginated(@PathParam("eventId") Integer eventId,
                                               @QueryParam("page") @DefaultValue("1") int page,
                                               @QueryParam("limit") @DefaultValue("10") int limit) {
        if (!this.eventService.existsById(eventId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Event not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        
        int offset = (page - 1) * limit;
        List<Comment> comments = this.commentService.findCommentsByEventIdPaginated(eventId, offset, limit);
        
        Map<String, Object> response = new HashMap<>();
        response.put("comments", comments);
        response.put("page", page);
        response.put("limit", limit);
        response.put("eventId", eventId);
        return Response.ok(response).build();
    }

    @POST
    @Path("/{id}/like")
    @Produces(MediaType.APPLICATION_JSON)
    public Response likeComment(@PathParam("id") Integer commentId) {
        if (!this.commentService.existsById(commentId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        HttpSession session = request.getSession();
        String likedKey = "liked_comment_" + commentId;
        String dislikedKey = "disliked_comment_" + commentId;
        
        Boolean hasLiked = (Boolean) session.getAttribute(likedKey);
        Boolean hasDisliked = (Boolean) session.getAttribute(dislikedKey);
        
        Map<String, Object> response = new HashMap<>();
        
        if (Boolean.TRUE.equals(hasLiked)) {
            this.commentService.decrementLikes(commentId);
            session.removeAttribute(likedKey);
            response.put("message", "Like removed from comment");
            response.put("action", "unliked");
        } else {
            if (Boolean.TRUE.equals(hasDisliked)) {
                this.commentService.decrementDislikes(commentId);
                session.removeAttribute(dislikedKey);
            }
            this.commentService.incrementLikes(commentId);
            session.setAttribute(likedKey, true);
            response.put("message", "Comment liked");
            response.put("action", "liked");
        }
        
        Comment updatedComment = this.commentService.findComment(commentId);
        response.put("hasLiked", session.getAttribute(likedKey) != null);
        response.put("hasDisliked", session.getAttribute(dislikedKey) != null);
        response.put("likeCount", updatedComment.getLikeCount());
        response.put("dislikeCount", updatedComment.getDislikeCount());
        
        return Response.ok(response).build();
    }

    @POST
    @Path("/{id}/dislike")
    @Produces(MediaType.APPLICATION_JSON)
    public Response dislikeComment(@PathParam("id") Integer commentId) {
        if (!this.commentService.existsById(commentId)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        HttpSession session = request.getSession();
        String likedKey = "liked_comment_" + commentId;
        String dislikedKey = "disliked_comment_" + commentId;
        
        Boolean hasLiked = (Boolean) session.getAttribute(likedKey);
        Boolean hasDisliked = (Boolean) session.getAttribute(dislikedKey);
        
        Map<String, Object> response = new HashMap<>();
        
        if (Boolean.TRUE.equals(hasDisliked)) {
            this.commentService.decrementDislikes(commentId);
            session.removeAttribute(dislikedKey);
            response.put("message", "Dislike removed from comment");
            response.put("action", "undisliked");
        } else {
            if (Boolean.TRUE.equals(hasLiked)) {
                this.commentService.decrementLikes(commentId);
                session.removeAttribute(likedKey);
            }
            this.commentService.incrementDislikes(commentId);
            session.setAttribute(dislikedKey, true);
            response.put("message", "Comment disliked");
            response.put("action", "disliked");
        }
        
        Comment updatedComment = this.commentService.findComment(commentId);
        response.put("hasLiked", session.getAttribute(likedKey) != null);
        response.put("hasDisliked", session.getAttribute(dislikedKey) != null);
        response.put("likeCount", updatedComment.getLikeCount());
        response.put("dislikeCount", updatedComment.getDislikeCount());
        
        return Response.ok(response).build();
    }
}