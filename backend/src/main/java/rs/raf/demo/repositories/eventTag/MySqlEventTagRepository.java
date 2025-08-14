package rs.raf.demo.repositories.eventTag;

import rs.raf.demo.entities.EventTag;
import rs.raf.demo.repositories.MySqlAbstractRepository;

import java.sql.*;
import java.util.List;

public class MySqlEventTagRepository extends MySqlAbstractRepository implements EventTagRepository {

    @Override
    public void addEventTag(Integer eventId, Integer tagId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "INSERT INTO event_tag (event_id, tag_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE event_id=event_id"
            );
            preparedStatement.setInt(1, eventId);
            preparedStatement.setInt(2, tagId);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    @Override
    public void removeEventTag(Integer eventId, Integer tagId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "DELETE FROM event_tag WHERE event_id = ? AND tag_id = ?"
            );
            preparedStatement.setInt(1, eventId);
            preparedStatement.setInt(2, tagId);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    @Override
    public void removeAllTagsForEvent(Integer eventId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("DELETE FROM event_tag WHERE event_id = ?");
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
    public boolean eventHasTag(Integer eventId, Integer tagId) {
        boolean hasTag = false;
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement(
                "SELECT 1 FROM event_tag WHERE event_id = ? AND tag_id = ? LIMIT 1"
            );
            preparedStatement.setInt(1, eventId);
            preparedStatement.setInt(2, tagId);
            resultSet = preparedStatement.executeQuery();

            hasTag = resultSet.next();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return hasTag;
    }
}
