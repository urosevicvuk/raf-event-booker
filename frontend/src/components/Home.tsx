import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';

const Home: React.FC = () => {
    return (
        <Container className="text-center mt-5">
            <h1 className="mb-4">Dobrodošli na RAF Event Booker!</h1>
            <p className="lead">Ovde možete da pregledate događaje i rezervišete mesta.</p>

            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <img
                        src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Događaji"
                        className="img-fluid rounded"
                    />
                </Col>
            </Row>

            <h2 className="mt-4">Kako koristiti:</h2>
            <ListGroup className="w-50 mx-auto">
                <ListGroup.Item>Pregledajte dostupne događaje.</ListGroup.Item>
                <ListGroup.Item>Odaberite događaj za više informacija.</ListGroup.Item>
            </ListGroup>
        </Container>
    );
};

export default Home;