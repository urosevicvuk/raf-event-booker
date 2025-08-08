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

    // Event-related comment methods (using existing repository methods)
    public List<Comment> findCommentsByEventId(Integer eventId) {
        return this.commentRepository.findCommentsByEventId(eventId);
    }

    // Reaction methods - simplified
    public void likeComment(Integer commentId) {
        Comment comment = this.commentRepository.findComment(commentId);
        if (comment != null) {
            comment.setLikeCount(comment.getLikeCount() + 1);
            this.commentRepository.updateComment(comment);
        }
    }

    public void dislikeComment(Integer commentId) {
        Comment comment = this.commentRepository.findComment(commentId);
        if (comment != null) {
            comment.setDislikeCount(comment.getDislikeCount() + 1);
            this.commentRepository.updateComment(comment);
        }
    }
}