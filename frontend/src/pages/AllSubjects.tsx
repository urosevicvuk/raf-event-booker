import React, { useState, useEffect } from "react";
import _axios from "../axiosInstance"; // Axios instance
import { Container, Row, Col, Table } from "react-bootstrap";
import SingleSubject from "../components/SingleSubject";

interface Subject {
    id: number;
    title: string;
    content: string;
}

const AllSubjects: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]); // List of subjects
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null); // Selected subject

    // Function for shortening text
    const shortText = (text: string): string => (text.length < 30 ? text : text.slice(0, 30) + "...");

    // Load subjects on first render
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await _axios.get("/subjects");
                console.log(response); // Log data
                // Strict mode can contribute to double calls due to change identification
                setSubjects(response.data); // Set data in state
            } catch (error) {
                console.error("Error loading subjects:", error);
            }
        };

        fetchSubjects();
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Predmeti</h1>

            <Row>
                {/* Table with subjects */}
                <Col md={5}>
                    <Table striped bordered hover responsive>
                        <thead className="table-primary">
                            <tr>
                                <th>ID</th>
                                <th>Naslov</th>
                                <th>Sadržaj</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.id} onClick={() => setSelectedSubject(subject)} style={{ cursor: "pointer" }}>
                                    <td>{subject.id}</td>
                                    <td>{subject.title}</td>
                                    <td>{shortText(subject.content)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>

                {/* Display selected subject */}
                <Col md={7}>
                    {/* null && string value = null */}
                    {/* !null && string value = string value */}
                    {/* false && string value = false */}
                    {/* true && string value = string value */}
                    {selectedSubject && (
                        <SingleSubject subject={selectedSubject} />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AllSubjects;