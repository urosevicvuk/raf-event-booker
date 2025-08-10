import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../auth";

const NavigationBar: React.FC = () => {
    const location = useLocation(); // Get current route
    const navigate = useNavigate(); // Function for navigation between pages

    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
                {/* Link to home page, Brand is like Home page */}
                <Navbar.Brand as={Link} to="/">RAF Event Booker</Navbar.Brand>

                {/* Button for showing menu on smaller screens */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* Main menu */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Links to different sections */}
                        <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/subjects" className={location.pathname === "/subjects" ? "active" : ""}>
                            All Subjects
                        </Nav.Link>
                    </Nav>

                    {isAuthenticated() ? (
                        <Button variant="danger" onClick={() => logout(navigate)}>Logout</Button>
                    ) : (
                        <Button variant="success" as={Link} to="/login">Login</Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;