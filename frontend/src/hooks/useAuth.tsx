import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {AuthContextType, User} from '../types';
import {AuthService} from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Provera postojanja tokena i korisničkih podataka
    const storedToken = AuthService.getToken();
    const storedUser = AuthService.getUser();
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await AuthService.login({ email, password });
      const jwt = response.jwt;
      
      // Dekodiranje JWT tokena
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      
      // Kreiranje osnovnih korisničkih podataka
      const userInfo: User = {
        id: 0, // Will be set when we get user details
        email: payload.sub,
        firstName: '',
        lastName: '',
        userType: payload.role,
        status: 'active'
      };

      AuthService.saveToken(jwt);
      
      // Učitavanje kompletnih korisničkih podataka
      try {
        const fullUser = await AuthService.getUserByEmail(payload.sub);
        const completeUser = { ...userInfo, ...fullUser };
        AuthService.saveUser(completeUser);
        setUser(completeUser);
      } catch {
        AuthService.saveUser(userInfo);
        setUser(userInfo);
      }
      
      setToken(jwt);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = (): void => {
    AuthService.logout();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.userType === 'admin';
  const isEventCreator = user?.userType === 'event creator' || user?.userType === 'admin';

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isEventCreator,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;