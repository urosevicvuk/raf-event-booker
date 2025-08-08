package rs.raf.demo.repositories.tag;

import rs.raf.demo.entities.Tag;

import java.util.List;

public interface TagRepository {
    public Tag addTag(Tag tag);
    public List<Tag> allTags();
    public Tag findTag(Integer id);
    public Tag findByName(String name);
    public Tag findTagByName(String name);  // Added for TagService compatibility
    public Tag updateTag(Tag tag);  // Added missing method
    public List<Tag> findTagsByEventId(Integer eventId);
    public void deleteTag(Integer id);
    public boolean existsById(Integer id);
    public boolean existsByName(String name);  // Added missing method
}
