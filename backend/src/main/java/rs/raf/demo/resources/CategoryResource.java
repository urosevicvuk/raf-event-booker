package rs.raf.demo.resources;

import rs.raf.demo.entities.Category;
import rs.raf.demo.entities.Event;
import rs.raf.demo.services.CategoryService;
import rs.raf.demo.services.EventService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/categories")
public class CategoryResource {

    @Inject
    private CategoryService categoryService;
    
    @Inject
    private EventService eventService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Category> all() {
        return this.categoryService.allCategories();
    }

    @GET
    @Path("/paginated")
    @Produces(MediaType.APPLICATION_JSON)
    public Response allPaginated(@QueryParam("page") @DefaultValue("1") int page,
                                @QueryParam("limit") @DefaultValue("10") int limit) {
        try {
            List<Category> allCategories = this.categoryService.allCategories();
            
            int total = allCategories.size();
            int offset = (page - 1) * limit;
            int endIndex = Math.min(offset + limit, total);
            
            List<Category> paginatedCategories;
            if (offset >= total) {
                paginatedCategories = List.of();
            } else {
                paginatedCategories = allCategories.subList(offset, endIndex);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("categories", paginatedCategories);
            response.put("page", page);
            response.put("limit", limit);
            response.put("total", total);
            
            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving categories: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(@Valid Category category) {
        try {
            Category savedCategory = this.categoryService.addCategory(category);
            return Response.status(Response.Status.CREATED).entity(savedCategory).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating category: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response find(@PathParam("id") Integer id) {
        Category category = this.categoryService.findCategory(id);
        if (category == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }
        return Response.ok(category).build();
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") Integer id, @Valid Category category) {
        if (!this.categoryService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        try {
            Category existingCategory = this.categoryService.findCategoryByName(category.getName());
            if (existingCategory != null && !existingCategory.getId().equals(id)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Category name already exists");
                return Response.status(Response.Status.CONFLICT).entity(response).build();
            }

            category.setId(id);
            Category updatedCategory = this.categoryService.updateCategory(category);
            return Response.ok(updatedCategory).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating category: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST).entity(response).build();
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") Integer id) {
        if (!this.categoryService.existsById(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        if (this.categoryService.hasEvents(id)) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cannot delete category with existing events");
            return Response.status(Response.Status.CONFLICT).entity(response).build();
        }

        try {
            this.categoryService.deleteCategory(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category deleted successfully");
            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting category: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }

    @GET
    @Path("/{id}/events")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEventsByCategory(@PathParam("id") Integer categoryId,
                                       @QueryParam("page") @DefaultValue("1") int page,
                                       @QueryParam("limit") @DefaultValue("10") int limit) {
        Category category = this.categoryService.findCategory(categoryId);
        if (category == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category not found");
            return Response.status(Response.Status.NOT_FOUND).entity(response).build();
        }

        try {
            int offset = (page - 1) * limit;
            List<Event> events = this.eventService.findEventsByCategoryPaginated(categoryId, offset, limit);
            events = this.eventService.populateEventsWithTags(events);
            
            Map<String, Object> response = new HashMap<>();
            response.put("events", events);
            response.put("page", page);
            response.put("limit", limit);
            return Response.ok(response).build();
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error fetching events: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(response).build();
        }
    }
}