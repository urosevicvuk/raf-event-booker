package rs.raf.demo.services;

import rs.raf.demo.entities.Tag;
import rs.raf.demo.repositories.tag.TagRepository;
import rs.raf.demo.repositories.eventTag.EventTagRepository;

import javax.inject.Inject;
import java.util.List;
import java.util.ArrayList;

public class TagService {

    public TagService() {
        System.out.println(this);
    }

    @Inject
    private TagRepository tagRepository;
    
    @Inject
    private EventTagRepository eventTagRepository;

    public Tag addTag(Tag tag) {
        return this.tagRepository.addTag(tag);
    }

    public List<Tag> allTags() {
        return this.tagRepository.allTags();
    }

    public Tag findTag(Integer id) {
        return this.tagRepository.findTag(id);
    }

    public Tag findTagByName(String name) {
        return this.tagRepository.findTagByName(name);
    }

    public boolean existsById(Integer id) {
        return this.tagRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return this.tagRepository.existsByName(name);
    }

    public List<Tag> getTagsForEvent(Integer eventId) {
        return this.tagRepository.findTagsByEventId(eventId);
    }

    public List<Tag> findOrCreateTags(String tagsString) {
        if (tagsString == null || tagsString.trim().isEmpty()) {
            return new ArrayList<>();
        }

        // Split by comma, hyphen, or semicolon and clean up
        String[] tagNames = tagsString.split("[,;-]");
        List<Tag> tags = new ArrayList<>();

        for (String tagName : tagNames) {
            String cleanTagName = tagName.trim().toLowerCase();
            if (!cleanTagName.isEmpty()) {
                Tag existingTag = this.findTagByName(cleanTagName);
                if (existingTag == null) {
                    Tag newTag = new Tag();
                    newTag.setName(cleanTagName);
                    existingTag = this.addTag(newTag);
                }
                tags.add(existingTag);
            }
        }

        return tags;
    }

    public void assignTagsToEvent(Integer eventId, List<Tag> tags) {
        this.eventTagRepository.removeAllTagsForEvent(eventId);
        
        for (Tag tag : tags) {
            this.eventTagRepository.addEventTag(eventId, tag.getId());
        }
    }
    
    public void removeTagFromEvent(Integer eventId, Integer tagId) {
        this.eventTagRepository.removeEventTag(eventId, tagId);
    }
    
    public boolean eventHasTag(Integer eventId, Integer tagId) {
        return this.eventTagRepository.eventHasTag(eventId, tagId);
    }
}