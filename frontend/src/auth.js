// Funkcije za autentikaciju korisnika -> proverava JWT
export const isAuthenticated = () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return false;

    try {
        const parts = jwt.split(".");
        if (parts.length !== 3) return false; // JWT mora imati tri dela

        const payload = JSON.parse(atob(parts[1])); // Dekodiramo payload

        if (!payload.exp) return false; // Ako nema exp, nije validan

        return Date.now() < payload.exp * 1000; // Proverava da li je token istekao
    } catch (error) {
        console.error("Greška pri dekodiranju JWT tokena:", error);
        return false; // Ako dođe do greške, vraća false
    }
};

// Funkcija za odjavu korisnika
export const logout = (navigate) => {
    localStorage.removeItem("jwt");
    navigate("/login");
};
