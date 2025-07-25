import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import StarRating from "../components/StarRating";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genreFilter, setGenreFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async (page, genre, author) => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10 };
      if (genre) params.genre = genre;
      if (author) params.author = author;

      const res = await API.get("/books", { params });
      setBooks(res.data.books);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching books:", err.response?.data || err.message);
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage, genreFilter, authorFilter);
  }, [currentPage, genreFilter, authorFilter]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          Discover Books
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Filter by Genre..."
            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Author..."
            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          />
          <button
            onClick={() => {
              setGenreFilter("");
              setAuthorFilter("");
              setCurrentPage(1);
            }}
            className="w-full md:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-200"
          >
            Clear Filters
          </button>
        </div>

        {loading && (
          <p className="text-center text-blue-600 text-lg">Loading books...</p>
        )}
        {error && <p className="text-center text-red-500 text-lg">{error}</p>}
        {!loading && books.length === 0 && !error && (
          <p className="text-center text-gray-600 text-lg">
            No books found matching your criteria.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 overflow-hidden"
            >
              <Link to={`/books/${book._id}`} className="block">
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/150x200?text=No+Cover";
                      }} 
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">
                      No Cover Available
                    </span>
                  )}
                </div>

                <div className="p-6">
                  {" "}
                  <h2
                    className="text-2xl font-bold text-gray-900 mb-2 truncate"
                    title={book.title}
                  >
                    {book.title}
                  </h2>
                  <p className="text-gray-700 text-lg mb-1">
                    by <span className="font-medium">{book.author}</span>
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Genre: {book.genre}
                  </p>
                  <div className="flex items-center">
                    <StarRating rating={book.averageRating} />
                    <span className="ml-2 text-gray-600 text-sm">
                      (
                      {book.averageRating !== undefined &&
                      book.averageRating !== null
                        ? book.averageRating.toFixed(1)
                        : "N/A"}
                      )
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
            >
              Previous
            </button>
            <span className="text-lg font-medium text-gray-800">
              Page <span className="text-blue-600">{currentPage}</span> of{" "}
              <span className="text-blue-600">{totalPages}</span>
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
