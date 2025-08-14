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

    public List<User> allUsers(int page, int limit) {
        List<User> allUsers = this.userRepository.allUsers();
        int startIndex = (page - 1) * limit;
        int endIndex = Math.min(startIndex + limit, allUsers.size());
        
        if (startIndex >= allUsers.size()) {
            return new java.util.ArrayList<>();
        }
        
        return allUsers.subList(startIndex, endIndex);
    }

    public User findUser(Integer id) {
        return this.userRepository.findUser(id);
    }

    public User findUserByEmail(String email) {
        return this.userRepository.findUserByEmail(email);
    }

    public User updateUser(User user) {
        // If password is being updated, hash it
        if (user.getHashedPassword() != null && !user.getHashedPassword().isEmpty()) {
            // Check if it's already hashed (SHA-256 hashes are 64 chars long)
            if (user.getHashedPassword().length() != 64) {
                user.setHashedPassword(DigestUtils.sha256Hex(user.getHashedPassword()));
            }
        }
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

    public User activateUser(Integer id) {
        User user = this.findUser(id);
        if (user != null) {
            user.setStatus("active");
            return this.userRepository.updateUser(user);
        }
        return null;
    }

    public User deactivateUser(Integer id) {
        User user = this.findUser(id);
        if (user != null && !"admin".equals(user.getUserType())) {
            user.setStatus("inactive");
            return this.userRepository.updateUser(user);
        }
        return null; // Cannot deactivate admin users
    }

    public boolean canDeleteUser(Integer id) {
        User user = this.findUser(id);
        return user != null && !"admin".equals(user.getUserType());
    }

    public void safeDeleteUser(Integer id) {
        if (this.canDeleteUser(id)) {
            this.deleteUser(id);
        } else {
            throw new RuntimeException("Cannot delete admin user");
        }
    }

    public boolean changePassword(Integer userId, String newPassword) {
        User user = this.findUser(userId);
        if (user != null) {
            user.setHashedPassword(DigestUtils.sha256Hex(newPassword));
            this.userRepository.updateUser(user);
            return true;
        }
        return false;
    }
}
