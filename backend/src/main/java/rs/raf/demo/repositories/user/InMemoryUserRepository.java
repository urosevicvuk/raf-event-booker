package rs.raf.demo.repositories.user;

import org.apache.commons.codec.digest.DigestUtils;
import rs.raf.demo.entities.User;

import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class InMemoryUserRepository implements UserRepository {
    private static List<User> USERS = new CopyOnWriteArrayList<>();

    //static {
    //    USERS.add(new User("admin_user", "admin", "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3")); // 123
    //    USERS.add(new User("support_user", "support", "2ac9a6746aca543af8dff39894cfe8173afba21eb01c6fae33d52947222855ef")); // 000
    //}

    @Override
    public User findUser(String username) {
        User user = null;
        Iterator<User> userIterator = USERS.iterator();
        while (userIterator.hasNext() && user == null) {
            User u = userIterator.next();
            if (u.getEmail().equals(username)) {
                user = u;
            }
        }

        return user;
    }
}
