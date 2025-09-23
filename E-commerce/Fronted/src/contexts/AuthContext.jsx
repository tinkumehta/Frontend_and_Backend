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

    // In AuthContext.jsx - Update the login function
const login = async (credentials) => {
  try {
    setError('');
    const response = await authService.login(credentials);
    
    // Debug: Log the response to see the actual structure
    console.log('Login response:', response);
    
    // Handle different response structures
    let token, userData;
    
    if (response.data && response.data.token) {
      // If token is in response.data
      token = response.data.token;
      userData = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      };
    } else if (response.data && response.data.user) {
      // If user data is nested under user property
      token = response.data.token;
      userData = response.data.user;
    } else if (response.token) {
      // If response is the data directly
      token = response.token;
      userData = {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role
      };
    } else {
      throw new Error('Invalid response format from server');
    }
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return response;
  } catch (error) {
    console.error('Login error details:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    setError(errorMessage);
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