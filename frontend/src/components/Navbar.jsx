import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Book Review App
        </Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/books/add" className="mr-4 hover:text-gray-300">
                Add Book
              </Link>
              <button onClick={logout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:text-gray-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-gray-300">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;