package rs.raf.demo.repositories.comment;

import rs.raf.demo.entities.Comment;
import rs.raf.demo.repositories.MySqlAbstractRepository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class MySqlCommentRepository extends MySqlAbstractRepository implements CommentRepository {

    @Override
    public Comment addComment(Comment comment) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            String[] generatedColumns = {"id"};

            preparedStatement = connection.prepareStatement(
                "INSERT INTO comment (author_name, text, created_at, event_id, like_count, dislike_count) VALUES(?, ?, ?, ?, ?, ?)", 
                generatedColumns
            );
            preparedStatement.setString(1, comment.getAuthorName());
            preparedStatement.setString(2, comment.getText());
            // Handle potential null creation time - should not happen if service layer works correctly
            LocalDateTime creationTime = comment.getCreatedAt() != null ? comment.getCreatedAt() : LocalDateTime.now();
            preparedStatement.setTimestamp(3, Timestamp.valueOf(creationTime));
            preparedStatement.setInt(4, comment.getEventId());
            preparedStatement.setInt(5, comment.getLikeCount() != null ? comment.getLikeCount() : 0);
            preparedStatement.setInt(6, comment.getDislikeCount() != null ? comment.getDislikeCount() : 0);
            preparedStatement.executeUpdate();
            resultSet = preparedStatement.getGeneratedKeys();

            if (resultSet.next()) {
                comment.setId(resultSet.getInt(1));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return comment;
    }

    @Override
    public List<Comment> allComments() {
        List<Comment> comments = new ArrayList<>();

        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            statement = connection.createStatement();
            resultSet = statement.executeQuery("SELECT * FROM comment ORDER BY created_at DESC");
            while (resultSet.next()) {
                comments.add(mapResultSetToComment(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(statement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return comments;
    }

    @Override
    public Comment findComment(Integer id) {
        Comment comment = null;

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM comment WHERE id = ?");
            preparedStatement.setInt(1, id);
            resultSet = preparedStatement.executeQuery();

            if(resultSet.next()) {
                comment = mapResultSetToComment(resultSet);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return comment;
    }

    @Override
    public List<Comment> findCommentsByEventId(Integer eventId) {
        List<Comment> comments = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM comment WHERE event_id = ? ORDER BY created_at DESC");
            preparedStatement.setInt(1, eventId);
            resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                comments.add(mapResultSetToComment(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return comments;
    }

    @Override
    public List<Comment> findCommentsByEventId(Integer eventId, int page, int limit) {
        List<Comment> comments = new ArrayList<>();
        int offset = (page - 1) * limit;

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT * FROM comment WHERE event_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
            );
            preparedStatement.setInt(1, eventId);
            preparedStatement.setInt(2, limit);
            preparedStatement.setInt(3, offset);
            resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                comments.add(mapResultSetToComment(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return comments;
    }

    @Override
    public Comment updateComment(Comment comment) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "UPDATE comment SET author_name = ?, text = ?, like_count = ?, dislike_count = ? WHERE id = ?"
            );
            preparedStatement.setString(1, comment.getAuthorName());
            preparedStatement.setString(2, comment.getText());
            preparedStatement.setInt(3, comment.getLikeCount());
            preparedStatement.setInt(4, comment.getDislikeCount());
            preparedStatement.setInt(5, comment.getId());
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }

        return comment;
    }

    @Override
    public void deleteComment(Integer id) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("DELETE FROM comment WHERE id = ?");
            preparedStatement.setInt(1, id);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    @Override
    public void deleteCommentsByEventId(Integer eventId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("DELETE FROM comment WHERE event_id = ?");
            preparedStatement.setInt(1, eventId);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    @Override
    public boolean existsById(Integer id) {
        boolean exists = false;
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT 1 FROM comment WHERE id = ?");
            preparedStatement.setInt(1, id);
            resultSet = preparedStatement.executeQuery();

            exists = resultSet.next();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return exists;
    }

    @Override
    public long countCommentsByEventId(Integer eventId) {
        long count = 0;
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT COUNT(*) FROM comment WHERE event_id = ?");
            preparedStatement.setInt(1, eventId);
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                count = resultSet.getLong(1);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return count;
    }

    @Override
    public List<Comment> findCommentsByEventIdPaginated(Integer eventId, int offset, int limit) {
        List<Comment> comments = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT * FROM comment WHERE event_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
            );
            preparedStatement.setInt(1, eventId);
            preparedStatement.setInt(2, limit);
            preparedStatement.setInt(3, offset);
            resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                comments.add(mapResultSetToComment(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return comments;
    }

    @Override
    public void incrementLikes(Integer commentId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE comment SET like_count = like_count + 1 WHERE id = ?");
            preparedStatement.setInt(1, commentId);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    @Override
    public void decrementLikes(Integer commentId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE comment SET like_count = GREATEST(0, like_count - 1) WHERE id = ?");
            preparedStatement.setInt(1, commentId);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    @Override
    public void incrementDislikes(Integer commentId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE comment SET dislike_count = dislike_count + 1 WHERE id = ?");
            preparedStatement.setInt(1, commentId);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    @Override
    public void decrementDislikes(Integer commentId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE comment SET dislike_count = GREATEST(0, dislike_count - 1) WHERE id = ?");
            preparedStatement.setInt(1, commentId);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    private Comment mapResultSetToComment(ResultSet resultSet) throws SQLException {
        LocalDateTime createdAt = resultSet.getTimestamp("created_at").toLocalDateTime();
        
        return new Comment(
            resultSet.getInt("id"),
            resultSet.getString("author_name"),
            resultSet.getString("text"),
            createdAt,
            resultSet.getInt("event_id"),
            resultSet.getInt("like_count"),
            resultSet.getInt("dislike_count")
        );
    }
}
