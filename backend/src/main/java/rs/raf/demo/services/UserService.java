package rs.raf.demo.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.apache.commons.codec.digest.DigestUtils;
import rs.raf.demo.entities.User;
import rs.raf.demo.repositories.user.UserRepository;

import javax.inject.Inject;
import java.util.Date;
import java.util.List;

public class UserService {

    @Inject
    UserRepository userRepository;

    public String login(String username, String password)
    {
        String hashedPassword = DigestUtils.sha256Hex(password);

        User user = this.userRepository.findUserByEmail(username);
        if (user == null || !user.getHashedPassword().equals(hashedPassword)) {
            return null;
        }

        Date issuedAt = new Date();
        Date expiresAt = new Date(issuedAt.getTime() + 24*60*60*1000); // One day

        Algorithm algorithm = Algorithm.HMAC256("secret");

        // JWT-om mozete bezbedono poslati informacije na FE
        // Tako sto sve sto zelite da posaljete zapakujete u claims mapu
        return JWT.create()
                .withIssuedAt(issuedAt)
                .withExpiresAt(expiresAt)
                .withSubject(username)
                .withClaim("role", user.getUserType())
                .sign(algorithm);
    }

    public boolean isAuthorized(String token){
        Algorithm algorithm = Algorithm.HMAC256("secret");
        JWTVerifier verifier = JWT.require(algorithm)
                .build();
        DecodedJWT jwt = verifier.verify(token);

        String username = jwt.getSubject();
//        jwt.getClaim("role").asString();

        User user = this.userRepository.findUserByEmail(username);

        if (user == null){
            return false;
        }

        return true;
    }

    public User addUser(User user) {
        // Hash the password before saving
        if (user.getHashedPassword() != null) {
            user.setHashedPassword(DigestUtils.sha256Hex(user.getHashedPassword()));
        }
        return this.userRepository.addUser(user);
    }

    public List<User> allUsers() {
        return this.userRepository.allUsers();
    }

    public User findUser(Integer id) {
        return this.userRepository.findUser(id);
    }

    public User findUserByEmail(String email) {
        return this.userRepository.findUserByEmail(email);
    }

    public User updateUser(User user) {
        return this.userRepository.updateUser(user);
    }

    public void deleteUser(Integer id) {
        this.userRepository.deleteUser(id);
    }

    public boolean existsById(Integer id) {
        return this.userRepository.existsById(id);
    }

    public boolean existsByEmail(String email) {
        return this.userRepository.existsByEmail(email);
    }

    public List<User> findActiveUsers() {
        // Simple implementation using basic methods
        return this.userRepository.allUsers().stream()
                .filter(user -> "active".equals(user.getStatus()))
                .collect(java.util.stream.Collectors.toList());
    }

    public List<User> findUsersByType(String userType) {
        // Simple implementation using basic methods
        return this.userRepository.allUsers().stream()
                .filter(user -> userType.equals(user.getUserType()))
                .collect(java.util.stream.Collectors.toList());
    }
}
