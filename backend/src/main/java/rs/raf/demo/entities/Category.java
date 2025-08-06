package rs.raf.demo.entities;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class Category {
    private Integer id;
    
    @NotNull(message = "Category name field is required")
    @NotEmpty(message = "Category name field is required")
    private String name;
    
    @NotNull(message = "Description field is required")
    @NotEmpty(message = "Description field is required")
    private String description;

    public Category() {
    }

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Category(Integer id, String name, String description) {
        this(name, description);
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}