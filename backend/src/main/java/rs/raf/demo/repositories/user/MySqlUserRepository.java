package rs.raf.demo.repositories.user;

import rs.raf.demo.entities.User;
import rs.raf.demo.repositories.MySqlAbstractRepository;

public class MySqlUserRepository extends MySqlAbstractRepository implements UserRepository {
    @Override
    public User findUser(String username) {
        return null; //todo implement
    }
}
