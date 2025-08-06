package rs.raf.demo.resources;

import rs.raf.demo.services.SubjectService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.List;

@Path("/subjects")
public class SubjectResource {

    @Inject
    private SubjectService subjectService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Subject> all()
    {
        return this.subjectService.allSubjects();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Subject create(@Valid Subject subject) {
        return this.subjectService.addSubject(subject);
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Subject find(@PathParam("id") Integer id) {
        return this.subjectService.findSubject(id);
    }

    @DELETE
    @Path("/{id}")
    public void delete(@PathParam("id") Integer id) {
        this.subjectService.deleteSubject(id);
    }

}
