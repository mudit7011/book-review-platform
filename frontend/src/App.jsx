import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import BookDetail from './pages/BookDetail';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar'; // Import Navbar

export default function App() {
  return (
    <> {/* Use a Fragment to wrap Navbar and Routes */}
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<BookList />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Route>

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}