package rs.raf.demo.services;

import rs.raf.demo.entities.Comment;
import rs.raf.demo.repositories.comment.CommentRepository;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;

public class CommentService {

    public CommentService() {
        System.out.println(this);
    }

    @Inject
    private CommentRepository commentRepository;

    public Comment addComment(Comment comment) {
        // Set creation time if not set
        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(LocalDateTime.now());
        }
        
        // Initialize counters if null
        if (comment.getLikeCount() == null) {
            comment.setLikeCount(0);
        }
        if (comment.getDislikeCount() == null) {
            comment.setDislikeCount(0);
        }
        
        return this.commentRepository.addComment(comment);
    }

    public List<Comment> allComments() {
        return this.commentRepository.allComments();
    }

    public Comment findComment(Integer id) {
        return this.commentRepository.findComment(id);
    }

    public Comment updateComment(Comment comment) {
        return this.commentRepository.updateComment(comment);
    }

    public void deleteComment(Integer id) {
        this.commentRepository.deleteComment(id);
    }

    public boolean existsById(Integer id) {
        return this.commentRepository.existsById(id);
    }

    // Event-related comment methods
    public List<Comment> findCommentsByEventId(Integer eventId) {
        return this.commentRepository.findCommentsByEventId(eventId);
    }

    public List<Comment> findCommentsByEventIdPaginated(Integer eventId, int offset, int limit) {
        return this.commentRepository.findCommentsByEventIdPaginated(eventId, offset, limit);
    }

    // Reaction methods with increment/decrement
    public void incrementLikes(Integer commentId) {
        this.commentRepository.incrementLikes(commentId);
    }

    public void decrementLikes(Integer commentId) {
        this.commentRepository.decrementLikes(commentId);
    }

    public void incrementDislikes(Integer commentId) {
        this.commentRepository.incrementDislikes(commentId);
    }

    public void decrementDislikes(Integer commentId) {
        this.commentRepository.decrementDislikes(commentId);
    }
}