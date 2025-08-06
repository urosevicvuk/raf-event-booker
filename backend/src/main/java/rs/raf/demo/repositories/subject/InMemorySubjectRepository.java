package rs.raf.demo.repositories.subject;

import rs.raf.demo.entities.Subject;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class InMemorySubjectRepository implements SubjectRepository {
    private static List<Subject> subjects = new CopyOnWriteArrayList<>();

    public InMemorySubjectRepository() {
        System.out.println(this);
    }

    @Override
    public synchronized Subject addSubject(Subject subject) {
        Integer id = subjects.size();
        subject.setId(id);
        subjects.add(Math.toIntExact(id), subject);

        return subject;
    }

    @Override
    public List<Subject> allSubjects() {
        return new ArrayList<>(subjects);
    }

    @Override
    public Subject findSubject(Integer id) {
        return subjects.get(id);
    }

    @Override
    public void deleteSubject(Integer id) {
        subjects.remove(id.intValue());
    }
}
