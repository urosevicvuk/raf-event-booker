package rs.raf.demo.repositories.rsvp;

import rs.raf.demo.entities.RSVP;
import rs.raf.demo.repositories.MySqlAbstractRepository;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class MySqlRSVPRepository extends MySqlAbstractRepository implements RSVPRepository {

    @Override
    public RSVP addRSVP(RSVP rsvp) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            String[] generatedColumns = {"id"};

            preparedStatement = connection.prepareStatement(
                "INSERT INTO rsvp (user_identifier, event_id, registration_date) VALUES(?, ?, ?)", 
                generatedColumns
            );
            preparedStatement.setString(1, rsvp.getUserIdentifier());
            preparedStatement.setInt(2, rsvp.getEventId());
            preparedStatement.setTimestamp(3, Timestamp.valueOf(rsvp.getRegistrationDate()));
            preparedStatement.executeUpdate();
            resultSet = preparedStatement.getGeneratedKeys();

            if (resultSet.next()) {
                rsvp.setId(resultSet.getInt(1));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return rsvp;
    }

    @Override
    public List<RSVP> allRSVPs() {
        List<RSVP> rsvps = new ArrayList<>();

        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            statement = connection.createStatement();
            resultSet = statement.executeQuery("SELECT * FROM rsvp ORDER BY registration_date DESC");
            while (resultSet.next()) {
                rsvps.add(mapResultSetToRSVP(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(statement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return rsvps;
    }

    @Override
    public RSVP findRSVP(Integer id) {
        RSVP rsvp = null;

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM rsvp WHERE id = ?");
            preparedStatement.setInt(1, id);
            resultSet = preparedStatement.executeQuery();

            if(resultSet.next()) {
                rsvp = mapResultSetToRSVP(resultSet);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return rsvp;
    }

    @Override
    public List<RSVP> findRSVPsByEventId(Integer eventId) {
        List<RSVP> rsvps = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM rsvp WHERE event_id = ? ORDER BY registration_date");
            preparedStatement.setInt(1, eventId);
            resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                rsvps.add(mapResultSetToRSVP(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return rsvps;
    }

    @Override
    public List<RSVP> findRSVPsByUserIdentifier(String userIdentifier) {
        List<RSVP> rsvps = new ArrayList<>();

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM rsvp WHERE user_identifier = ? ORDER BY registration_date DESC");
            preparedStatement.setString(1, userIdentifier);
            resultSet = preparedStatement.executeQuery();
            
            while (resultSet.next()) {
                rsvps.add(mapResultSetToRSVP(resultSet));
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return rsvps;
    }

    @Override
    public RSVP findRSVPByEventAndUser(Integer eventId, String userIdentifier) {
        RSVP rsvp = null;

        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT * FROM rsvp WHERE event_id = ? AND user_identifier = ?");
            preparedStatement.setInt(1, eventId);
            preparedStatement.setString(2, userIdentifier);
            resultSet = preparedStatement.executeQuery();

            if(resultSet.next()) {
                rsvp = mapResultSetToRSVP(resultSet);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeResultSet(resultSet);
            this.closeConnection(connection);
        }

        return rsvp;
    }

    @Override
    public void deleteRSVP(Integer id) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("DELETE FROM rsvp WHERE id = ?");
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
    public void deleteRSVP(Integer eventId, String userIdentifier) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("DELETE FROM rsvp WHERE event_id = ? AND user_identifier = ?");
            preparedStatement.setInt(1, eventId);
            preparedStatement.setString(2, userIdentifier);
            preparedStatement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            this.closeStatement(preparedStatement);
            this.closeConnection(connection);
        }
    }

    @Override
    public void deleteRSVPsByEventId(Integer eventId) {
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("DELETE FROM rsvp WHERE event_id = ?");
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

            preparedStatement = connection.prepareStatement("SELECT 1 FROM rsvp WHERE id = ?");
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
    public boolean existsByEventAndUser(Integer eventId, String userIdentifier) {
        boolean exists = false;
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT 1 FROM rsvp WHERE event_id = ? AND user_identifier = ?");
            preparedStatement.setInt(1, eventId);
            preparedStatement.setString(2, userIdentifier);
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
    public long countRSVPsByEventId(Integer eventId) {
        long count = 0;
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = this.newConnection();

            preparedStatement = connection.prepareStatement("SELECT COUNT(*) FROM rsvp WHERE event_id = ?");
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

    private RSVP mapResultSetToRSVP(ResultSet resultSet) throws SQLException {
        LocalDateTime registrationDate = resultSet.getTimestamp("registration_date").toLocalDateTime();
        
        return new RSVP(
            resultSet.getInt("id"),
            resultSet.getString("user_identifier"),
            resultSet.getInt("event_id"),
            registrationDate
        );
    }
}
