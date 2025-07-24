// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // New loading state

  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Read directly from localStorage here
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);

        if (decodedUser.exp * 1000 < Date.now()) {
          console.log('Token expired, logging out.');
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('token');
        } else {
          setToken(storedToken); // Ensure token state is set if coming from localStorage
          setIsAuthenticated(true);
          setUser(decodedUser.user);
          // Set Axios default header for all subsequent API calls
          API.defaults.headers.common['x-auth-token'] = storedToken; 
        }
      } catch (error) {
        console.error('Invalid token, logging out:', error);
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      // No token found, ensure states are reset
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token'); // Clear any potential lingering invalid token
    }
    setAuthLoading(false); // Authentication check is complete
  }, []); // Empty dependency array: runs only once on mount

  // Update effect for when token state *does* change (e.g., after login/logout)
  useEffect(() => {
    if (token) {
        try {
            const decodedUser = jwtDecode(token);
            if (decodedUser.exp * 1000 < Date.now()) {
                setAuthLoading(false); // Set loading to false before clearing token
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('token');
                console.log('Token expired after a state update, logging out.');
            } else {
                setIsAuthenticated(true);
                setUser(decodedUser.user);
                API.defaults.headers.common['x-auth-token'] = token;
            }
        } catch (error) {
            setAuthLoading(false); // Set loading to false before clearing token
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('token');
            console.error('Invalid token after a state update, logging out:', error);
        }
    } else {
        setIsAuthenticated(false);
        setUser(null);
        delete API.defaults.headers.common['x-auth-token']; // Remove header on logout
        // No need to setAuthLoading(false) here, as the first useEffect handles initial load
    }
  }, [token]);


  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token); // This will trigger the second useEffect
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.msg || 'Login failed' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const res = await API.post('/auth/signup', { username, email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token); // This will trigger the second useEffect
      return { success: true };
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.msg || 'Signup failed' };
    }
  };

  const logout = () => {
    setToken(null); // This will trigger the second useEffect
    localStorage.removeItem('token'); // Ensure token is removed from localStorage
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, signup, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);