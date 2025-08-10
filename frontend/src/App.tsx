import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import { lazy, Suspense, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { isAuthenticated } from "./auth";

// Lazy-loading is a technique that allows components to be loaded only when needed, e.g. when a route is hit
// This means components are loaded asynchronously, which means they load in the background
const HomePage = lazy(() => import("./pages/HomePage"));
const AllSubjects = lazy(() => import("./pages/AllSubjects"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

// This is a private route that checks if the user is logged in so
// element is the component we want to show if the user is logged in
// if false then we redirect the user to the login page
interface PrivateRouteProps {
    element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};

function App(): JSX.Element {
    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        const date = new Date(); // padStart adds zeros in front of number until length is 2
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
        setCurrentDate(formattedDate);
    }, []);

    return (
        <>
            <div className="App">
                <Router>
                    <div className="app-container">
                        <NavigationBar />
                        <main className="main-content">
                            {/* Suspense is a component that allows something to be executed while the page is loading.
                             For us it's the Spinner component (loading circle) */}
                            <Suspense fallback={<Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>}>
                                <Routes>
                                    {/* When a route is hit, the component (element) that corresponds to the route is displayed */}
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    {/* PrivateRoute is a component that checks if the user is logged in */}
                                    <Route path="/subjects" element={<PrivateRoute element={<AllSubjects />} />} />
                                </Routes>
                            </Suspense>
                        </main>
                    </div>
                </Router>
            </div>

            <h4>Računarski Fakultet</h4>
            <p>{currentDate}</p>
        </>
    );
}

export default App;