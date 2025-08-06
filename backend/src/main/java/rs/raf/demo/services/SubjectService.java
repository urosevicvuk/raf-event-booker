package rs.raf.demo.services;

import rs.raf.demo.entities.Subject;
import rs.raf.demo.repositories.subject.SubjectRepository;

import javax.inject.Inject;
import java.util.List;

public class SubjectService {

    public SubjectService() {
        System.out.println(this);
    }

    @Inject
    private SubjectRepository subjectRepository;

    public Subject addSubject(Subject subject) {
        return this.subjectRepository.addSubject(subject);
    }

    public List<Subject> allSubjects() {
        return this.subjectRepository.allSubjects();
    }

    public Subject findSubject(Integer id) {
        return this.subjectRepository.findSubject(id);
    }

    public void deleteSubject(Integer id) {
        this.subjectRepository.deleteSubject(id);
    }
}
