package rs.raf.demo.repositories.event;

import rs.raf.demo.entities.Event;
import rs.raf.demo.repositories.MySqlAbstractRepository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class MySqlEventRepository extends MySqlAbstractRepository implements EventRepository {

    @Override
    public Event addEvent(Event event) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            String[] generatedColumns = {"id"};

            preparedStatement = connection.prepareStatement(
                "INSERT INTO event (title, description, created_at, event_date, location, views, like_count, dislike_count, author_id, category_id, max_capacity) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                generatedColumns);
            preparedStatement.setString(1, event.getTitle());
            preparedStatement.setString(2, event.getDescription());
            preparedStatement.setTimestamp(3, Timestamp.valueOf(event.getCreatedAt()));
            preparedStatement.setTimestamp(4, Timestamp.valueOf(event.getEventDate()));
            preparedStatement.setString(5, event.getLocation());
            preparedStatement.setInt(6, event.getViews() != null ? event.getViews() : 0);
            preparedStatement.setInt(7, event.getLikeCount() != null ? event.getLikeCount() : 0);
            preparedStatement.setInt(8, event.getDislikeCount() != null ? event.getDislikeCount() : 0);
            preparedStatement.setInt(9, event.getAuthorId());
            preparedStatement.setInt(10, event.getCategoryId());
            if (event.getMaxCapacity() != null) {
                preparedStatement.setInt(11, event.getMaxCapacity());
            } else {
                preparedStatement.setNull(11, Types.INTEGER);
            }
            preparedStatement.executeUpdate();
            resultSet = preparedStatement.getGeneratedKeys();

            if (resultSet.next()) {
                event.setId(resultSet.getInt(1));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return event;
    }

    @Override
    public List<Event> allEvents() {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            statement = connection.createStatement();
            resultSet = statement.executeQuery("SELECT * FROM event ORDER BY created_at DESC");
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(statement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> allEventsPaginated(int offset, int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM event ORDER BY created_at DESC LIMIT ? OFFSET ?");
            preparedStatement.setInt(1, limit);
            preparedStatement.setInt(2, offset);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public Event findEvent(Integer id) {
        Event event = null;

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM event WHERE id = ?");
            preparedStatement.setInt(1, id);
            resultSet = preparedStatement.executeQuery();

            if(resultSet.next()) {
                event = mapResultSetToEvent(resultSet);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return event;
    }

    @Override
    public Event updateEvent(Event event) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "UPDATE event SET title = ?, description = ?, event_date = ?, location = ?, category_id = ?, max_capacity = ? WHERE id = ?");
            preparedStatement.setString(1, event.getTitle());
            preparedStatement.setString(2, event.getDescription());
            preparedStatement.setTimestamp(3, Timestamp.valueOf(event.getEventDate()));
            preparedStatement.setString(4, event.getLocation());
            preparedStatement.setInt(5, event.getCategoryId());
            if (event.getMaxCapacity() != null) {
                preparedStatement.setInt(6, event.getMaxCapacity());
            } else {
                preparedStatement.setNull(6, Types.INTEGER);
            }
            preparedStatement.setInt(7, event.getId());
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }

        return event;
    }

    @Override
    public void deleteEvent(Integer id) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("DELETE FROM event WHERE id = ?");
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
    public boolean existsById(Integer id) {
        boolean exists = false;
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT 1 FROM event WHERE id = ?");
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
    public List<Event> searchEventsByTitleOrDescription(String searchTerm) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT * FROM event WHERE title LIKE ? OR description LIKE ? ORDER BY created_at DESC");
            String searchPattern = "%" + searchTerm + "%";
            preparedStatement.setString(1, searchPattern);
            preparedStatement.setString(2, searchPattern);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> searchEventsByTitleOrDescriptionPaginated(String searchTerm, int offset, int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT * FROM event WHERE title LIKE ? OR description LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?");
            String searchPattern = "%" + searchTerm + "%";
            preparedStatement.setString(1, searchPattern);
            preparedStatement.setString(2, searchPattern);
            preparedStatement.setInt(3, limit);
            preparedStatement.setInt(4, offset);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findEventsByCategory(Integer categoryId) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM event WHERE category_id = ? ORDER BY created_at DESC");
            preparedStatement.setInt(1, categoryId);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findEventsByCategoryPaginated(Integer categoryId, int offset, int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT * FROM event WHERE category_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?");
            preparedStatement.setInt(1, categoryId);
            preparedStatement.setInt(2, limit);
            preparedStatement.setInt(3, offset);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findEventsByTag(Integer tagId) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT e.* FROM event e INNER JOIN event_tag et ON e.id = et.event_id WHERE et.tag_id = ? ORDER BY e.created_at DESC");
            preparedStatement.setInt(1, tagId);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findEventsByTagPaginated(Integer tagId, int offset, int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT e.* FROM event e INNER JOIN event_tag et ON e.id = et.event_id WHERE et.tag_id = ? ORDER BY e.created_at DESC LIMIT ? OFFSET ?");
            preparedStatement.setInt(1, tagId);
            preparedStatement.setInt(2, limit);
            preparedStatement.setInt(3, offset);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findEventsByAuthor(Integer authorId) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM event WHERE author_id = ? ORDER BY created_at DESC");
            preparedStatement.setInt(1, authorId);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findLatestEvents(int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM event ORDER BY created_at DESC LIMIT ?");
            preparedStatement.setInt(1, limit);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findMostVisitedEvents(int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM event ORDER BY views DESC LIMIT ?");
            preparedStatement.setInt(1, limit);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findMostVisitedEventsLast30Days(int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT * FROM event WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) ORDER BY views DESC LIMIT ?");
            preparedStatement.setInt(1, limit);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findMostReactedEvents(int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT * FROM event ORDER BY (like_count + dislike_count) DESC LIMIT ?");
            preparedStatement.setInt(1, limit);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public List<Event> findSimilarEvents(Integer eventId, int limit) {
        List<Event> events = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT DISTINCT e.* FROM event e " +
                "INNER JOIN event_tag et1 ON e.id = et1.event_id " +
                "INNER JOIN event_tag et2 ON et1.tag_id = et2.tag_id " +
                "WHERE et2.event_id = ? AND e.id != ? " +
                "ORDER BY e.created_at DESC LIMIT ?");
            preparedStatement.setInt(1, eventId);
            preparedStatement.setInt(2, eventId);
            preparedStatement.setInt(3, limit);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                events.add(mapResultSetToEvent(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return events;
    }

    @Override
    public void incrementViews(Integer eventId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE event SET views = views + 1 WHERE id = ?");
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
    public void incrementLikes(Integer eventId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE event SET like_count = like_count + 1 WHERE id = ?");
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
    public void incrementDislikes(Integer eventId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE event SET dislike_count = dislike_count + 1 WHERE id = ?");
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
    public void decrementLikes(Integer eventId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE event SET like_count = like_count - 1 WHERE id = ?");
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
    public void decrementDislikes(Integer eventId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("UPDATE event SET dislike_count = dislike_count - 1 WHERE id = ?");
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
    public int eventCount() {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;

        int count = 0;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT COUNT(*) FROM event");
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                count = resultSet.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }

        return count;
    }

    @Override
    public int getCurrentRSVPCount(Integer eventId) {
        int count = 0;
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT COUNT(*) FROM rsvp WHERE event_id = ?");
            preparedStatement.setInt(1, eventId);
            resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {
                count = resultSet.getInt(1);
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

    private Event mapResultSetToEvent(ResultSet resultSet) throws SQLException {
        Integer id = resultSet.getInt("id");
        String title = resultSet.getString("title");
        String description = resultSet.getString("description");
        LocalDateTime createdAt = resultSet.getTimestamp("created_at").toLocalDateTime();
        LocalDateTime eventDate = resultSet.getTimestamp("event_date").toLocalDateTime();
        String location = resultSet.getString("location");
        Integer views = resultSet.getInt("views");
        Integer likeCount = resultSet.getInt("like_count");
        Integer dislikeCount = resultSet.getInt("dislike_count");
        Integer authorId = resultSet.getInt("author_id");
        Integer categoryId = resultSet.getInt("category_id");
        Integer maxCapacity = resultSet.getObject("max_capacity") != null ? resultSet.getInt("max_capacity") : null;

        return new Event(id, title, description, createdAt, eventDate, location, views, likeCount, dislikeCount, authorId, categoryId, maxCapacity);
    }
}
