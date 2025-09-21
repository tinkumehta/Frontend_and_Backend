import React, {createContext, useContext, useState, useEffect} from "react";
import {authService} from '../services/authService';

 const AuthContext = createContext();

 export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
 };

 export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authService.getProfile()
              .then(response => {
                setUser(response.data);
              })
            .catch(error => {
                console.error('Failed to get user Profile:', error);
                localStorage.removeItem('token');
            })
            .finally(() => {
                setLoading(false);
            })
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            setError('');
            const response = await authService.login(credentials);
            const {token, ...userData} = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return response;
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            setError('');
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        setError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
 }