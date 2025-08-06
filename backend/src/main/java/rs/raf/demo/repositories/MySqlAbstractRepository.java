package rs.raf.demo.repositories;

import java.io.IOException;
import java.io.InputStream;
import java.sql.*;
import java.util.Optional;
import java.util.Properties;

abstract public class MySqlAbstractRepository {
    private static Properties dbProperties;
    
    static {
        dbProperties = new Properties();
        try (InputStream input = MySqlAbstractRepository.class.getClassLoader().getResourceAsStream("database.properties")) {
            if (input == null) {
                System.err.println("Warning: database.properties not found. Using default values. Copy database.properties.example to database.properties");
            } else {
                dbProperties.load(input);
            }
        } catch (IOException e) {
            System.err.println("Error loading database properties: " + e.getMessage());
        }
    }

    public MySqlAbstractRepository() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    protected Connection newConnection() throws SQLException {
        return DriverManager.getConnection(
                "jdbc:mysql://" + this.getHost() + ":" + this.getPort() + "/" + this.getDatabaseName(), this.getUsername(), this.getPassword()
        );
    }

    protected String getHost() {
        return dbProperties.getProperty("db.host", "localhost");
    }

    protected int getPort() {
        return Integer.parseInt(dbProperties.getProperty("db.port", "3306"));
    }

    protected String getDatabaseName() {
        return dbProperties.getProperty("db.name", "raf_event_booker");
    }

    protected String getUsername() {
        return dbProperties.getProperty("db.username", "root");
    }

    protected String getPassword() {
        return dbProperties.getProperty("db.password", "root");
    }

    protected void closeStatement(Statement statement) {
        try {
            Optional.of(statement).get().close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    protected void closeResultSet(ResultSet resultSet) {
        try {
            Optional.of(resultSet).get().close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    protected void closeConnection(Connection connection) {
        try {
            Optional.of(connection).get().close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
