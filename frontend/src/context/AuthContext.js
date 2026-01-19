import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token (omitting AsyncStorage for now to keep it simple)
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            console.log('Attempting login for:', username);
            const res = await api.post('/auth/login', { username, password });

            const userData = { ...res.data.user, token: res.data.accessToken };
            setUser(userData);
            setAuthToken(res.data.accessToken);
            return userData;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (username, password) => {
        try {
            console.log('Registering:', username);
            const res = await api.post('/auth/signup', { username, password });

            const userData = { ...res.data.user, token: res.data.accessToken };
            setUser(userData);
            setAuthToken(res.data.accessToken);
            return userData;
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
