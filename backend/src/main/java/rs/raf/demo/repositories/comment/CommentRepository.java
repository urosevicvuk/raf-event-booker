package rs.raf.demo.repositories.comment;

import rs.raf.demo.entities.Comment;

import java.util.List;

public interface CommentRepository {
    public Comment addComment(Comment comment);
    public List<Comment> allComments();
    public Comment findComment(Integer id);
    public List<Comment> findCommentsByEventId(Integer eventId);
    public List<Comment> findCommentsByEventId(Integer eventId, int page, int limit);
    public Comment updateComment(Comment comment);
    public void deleteComment(Integer id);
    public void deleteCommentsByEventId(Integer eventId);
    public boolean existsById(Integer id);
    public long countCommentsByEventId(Integer eventId);
}
