import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
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
          setToken(storedToken);
          setIsAuthenticated(true);
          setUser(decodedUser.user);
          API.defaults.headers.common['x-auth-token'] = storedToken; 
        }
      } catch (error) {
        console.error('Invalid token, logging out:', error);
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token')
      }
    } else {
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token')
    }
    setAuthLoading(false)
  }, [])

  useEffect(() => {
    if (token) {
        try {
            const decodedUser = jwtDecode(token);
            if (decodedUser.exp * 1000 < Date.now()) {
                setAuthLoading(false);
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
            setAuthLoading(false);
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem('token');
            console.error('Invalid token after a state update, logging out:', error);
        }
    } else {
        setIsAuthenticated(false);
        setUser(null);
        delete API.defaults.headers.common['x-auth-token']; 
    }
  }, [token]);


  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
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
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
      return { success: false, error: err.response?.data?.msg || 'Signup failed' };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, signup, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);