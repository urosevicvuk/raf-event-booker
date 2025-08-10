import React from 'react';
import { Card } from 'react-bootstrap';

interface Subject {
    id: number;
    title: string;
    content: string;
}

interface SingleSubjectProps {
    subject: Subject;
}

// Props is an object that contains all passed values (properties)
const SingleSubject: React.FC<SingleSubjectProps> = ({ subject }) => {
    const { title, content } = subject;

    return (
        <Card className="subject-card">
            <Card.Body>
                <Card.Title>Predmet: {title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Opis:</Card.Subtitle>
                <Card.Text>{content}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default SingleSubject;