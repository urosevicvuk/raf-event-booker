package rs.raf.demo.repositories.user;

import rs.raf.demo.entities.User;

public interface UserRepository {
    public User findUser(String username);
}
