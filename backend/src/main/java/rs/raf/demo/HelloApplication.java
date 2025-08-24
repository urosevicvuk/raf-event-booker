package rs.raf.demo;

import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.ServerProperties;

import rs.raf.demo.repositories.user.MySqlUserRepository;
import rs.raf.demo.repositories.user.UserRepository;
import rs.raf.demo.repositories.category.CategoryRepository;
import rs.raf.demo.repositories.category.MySqlCategoryRepository;
import rs.raf.demo.repositories.event.EventRepository;
import rs.raf.demo.repositories.event.MySqlEventRepository;
import rs.raf.demo.repositories.tag.TagRepository;
import rs.raf.demo.repositories.tag.MySqlTagRepository;
import rs.raf.demo.repositories.eventTag.EventTagRepository;
import rs.raf.demo.repositories.eventTag.MySqlEventTagRepository;
import rs.raf.demo.repositories.comment.CommentRepository;
import rs.raf.demo.repositories.comment.MySqlCommentRepository;
import rs.raf.demo.repositories.rsvp.RSVPRepository;
import rs.raf.demo.repositories.rsvp.MySqlRSVPRepository;

import rs.raf.demo.services.UserService;
import rs.raf.demo.services.CategoryService;
import rs.raf.demo.services.EventService;
import rs.raf.demo.services.TagService;
import rs.raf.demo.services.CommentService;
import rs.raf.demo.services.RSVPService;

import rs.raf.demo.config.JacksonConfig;

import javax.inject.Singleton;
import javax.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class HelloApplication extends ResourceConfig {

    public HelloApplication() {
        property(ServerProperties.BV_SEND_ERROR_IN_RESPONSE, true);

        AbstractBinder binder = new AbstractBinder() {
            @Override
            protected void configure() {
                this.bind(MySqlUserRepository.class).to(UserRepository.class).in(Singleton.class);
                this.bind(MySqlCategoryRepository.class).to(CategoryRepository.class).in(Singleton.class);
                this.bind(MySqlEventRepository.class).to(EventRepository.class).in(Singleton.class);
                this.bind(MySqlTagRepository.class).to(TagRepository.class).in(Singleton.class);
                this.bind(MySqlEventTagRepository.class).to(EventTagRepository.class).in(Singleton.class);
                this.bind(MySqlCommentRepository.class).to(CommentRepository.class).in(Singleton.class);
                this.bind(MySqlRSVPRepository.class).to(RSVPRepository.class).in(Singleton.class);

                this.bindAsContract(UserService.class);
                this.bindAsContract(CategoryService.class);
                this.bindAsContract(EventService.class);
                this.bindAsContract(TagService.class);
                this.bindAsContract(CommentService.class);
                this.bindAsContract(RSVPService.class);
            }
        };
        register(binder);

        register(JacksonConfig.class);

        packages("rs.raf.demo");
    }
}
