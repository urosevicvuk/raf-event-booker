package rs.raf.demo;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;
import rs.raf.demo.repositories.subject.InMemorySubjectRepository;
import rs.raf.demo.repositories.subject.MySqlSubjectRepository;
import rs.raf.demo.repositories.subject.SubjectRepository;
import rs.raf.demo.repositories.user.InMemoryUserRepository;
import rs.raf.demo.repositories.user.UserRepository;
import rs.raf.demo.services.SubjectService;
import rs.raf.demo.services.UserService;

import javax.inject.Singleton;
import javax.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class HelloApplication extends ResourceConfig {

    public HelloApplication() {
        // Ukljucujemo validaciju
        property(ServerProperties.BV_SEND_ERROR_IN_RESPONSE, true);

        // Definisemo implementacije u dependency container-u
        AbstractBinder binder = new AbstractBinder() {
            @Override
            protected void configure() {
                this.bind(MySqlSubjectRepository.class).to(SubjectRepository.class).in(Singleton.class);
                this.bind(InMemoryUserRepository.class).to(UserRepository.class).in(Singleton.class);

                this.bindAsContract(SubjectService.class);
                this.bindAsContract(UserService.class);
            }
        };
        register(binder);


        // Ucitavamo resurse
        packages("rs.raf.demo");
    }
}
