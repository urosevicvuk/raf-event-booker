import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { setToken } from '../auth';
import type { LoginRequest } from '../types';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate();

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const loginData: LoginRequest = {
                username: email, // Backend expects 'username' field but it's actually email
                password,
            };
            
            const response = await authService.login(loginData);
            console.log(response); // To see response in console as well
            
            setToken(response.jwt);
            navigate('/subjects');
        } catch (error) {
            setErrorMessage('Neispravno korisničko ime ili lozinka!');
            console.error('Login failed', error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="col-md-4">
                <div className="card p-4 shadow">
                    <h2 className="text-center mb-4">Prijava na sistem</h2>

                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <form onSubmit={login}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Unesite email adresu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Unesite lozinku"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Prijavi se</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;