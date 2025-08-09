package rs.raf.demo.repositories.comment;

import rs.raf.demo.entities.Comment;

import java.util.List;

public interface CommentRepository {
    public Comment addComment(Comment comment);
    public List<Comment> allComments();
    public Comment findComment(Integer id);
    public List<Comment> findCommentsByEventId(Integer eventId);
    public List<Comment> findCommentsByEventIdPaginated(Integer eventId, int offset, int limit);
    public List<Comment> findCommentsByEventId(Integer eventId, int page, int limit);
    public Comment updateComment(Comment comment);
    public void deleteComment(Integer id);
    public void deleteCommentsByEventId(Integer eventId);
    public boolean existsById(Integer id);
    public long countCommentsByEventId(Integer eventId);
    
    // Like/dislike methods
    public void incrementLikes(Integer commentId);
    public void decrementLikes(Integer commentId);
    public void incrementDislikes(Integer commentId);
    public void decrementDislikes(Integer commentId);
}
