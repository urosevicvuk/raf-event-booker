package rs.raf.demo.repositories.category;

import rs.raf.demo.entities.Category;

import java.util.List;

public interface CategoryRepository {
    public Category addCategory(Category category);
    public List<Category> allCategories();
    public Category findCategory(Integer id);
    public Category findCategoryByName(String name);
    public Category updateCategory(Category category);
    public void deleteCategory(Integer id);
    public boolean existsById(Integer id);
    public boolean existsByName(String name);
    public boolean hasEvents(Integer categoryId);
}
