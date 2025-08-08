package rs.raf.demo.repositories.user;

import rs.raf.demo.entities.User;

import java.util.List;

public interface UserRepository {
    public User addUser(User user);
    public List<User> allUsers();
    public User findUser(Integer id);
    public User findUserByEmail(String email);
    public User updateUser(User user);
    public void deleteUser(Integer id);
    public boolean existsById(Integer id);
    public boolean existsByEmail(String email);
    public List<User> findActiveUsers();
    public List<User> findUsersByType(String userType);
}
