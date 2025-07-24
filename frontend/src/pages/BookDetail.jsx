// src/pages/BookDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import API from '../api/axios';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user info

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const { isAuthenticated, user: currentUser } = useAuth(); // Get current user from context
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchBookDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get(`/books/${id}`);
      setBook(res.data.book);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
    } catch (err) {
      console.error('Error fetching book details:', err.response?.data || err.message);
      setError('Failed to fetch book details. Book not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    if (!isAuthenticated) {
      setReviewError('You must be logged in to add a review.');
      return;
    }
    try {
      await API.post(`/books/${id}/reviews`, {
        comment: newReviewText,
        rating: newReviewRating,
      });
      setReviewSuccess('Review added successfully!');
      setNewReviewText('');
      setNewReviewRating(1);
      fetchBookDetails(); // Re-fetch book details to update reviews and avg rating
    } catch (err) {
      console.error('Error submitting review:', err.response?.data || err.message);
      setReviewError(err.response?.data?.msg || 'Failed to add review. Please try again.');
    }
  };

  const handleDeleteBook = async () => {
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      try {
        await API.delete(`/books/${id}`);
        alert('Book deleted successfully!');
        navigate('/books'); // Redirect to book list after deletion
      } catch (err) {
        console.error('Error deleting book:', err.response?.data || err.message);
        setError(err.response?.data?.msg || 'Failed to delete book. You might not have permission.');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 text-lg">Loading book details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 text-lg">{error}</div>;
  }

  if (!book) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600 text-lg">Book not found.</div>;
  }

  // Determine if the current user is the owner of the book
  const isBookOwner = isAuthenticated && currentUser && book.addedBy === currentUser.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Book Cover Image */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="w-full h-auto bg-gray-200 flex items-center justify-center overflow-hidden object-contain rounded-lg shadow-md">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x400?text=No+Cover"; }}
                />
              ) : (
                <span className="text-gray-500 text-lg">No Cover Available</span>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-gray-700 text-xl mb-1">by <span className="font-semibold">{book.author}</span></p>
            <p className="text-gray-600 text-lg mb-4">Genre: <span className="font-medium">{book.genre}</span></p>
            <div className="flex items-center mb-4">
              <span className="text-xl font-semibold mr-2">Average Rating:</span>
              <StarRating rating={averageRating} />
            </div>
            <p className="text-gray-800 leading-relaxed">
                {book.description || 'No description available for this book.'}
            </p>
            {isBookOwner && (
              <button
                onClick={handleDeleteBook}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-200"
              >
                Delete Book
              </button>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <StarRating rating={review.rating} />
                    <p className="ml-4 text-gray-800 font-semibold">
                      {review.reviewer ? review.reviewer.username : 'Anonymous'}
                    </p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-2">{review.review_text}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Review Section */}
        {isAuthenticated && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Add Your Review</h2>
            {reviewError && <p className="text-red-500 mb-4 text-center">{reviewError}</p>}
            {reviewSuccess && <p className="text-green-500 mb-4 text-center">{reviewSuccess}</p>}
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label htmlFor="review_text" className="block text-gray-700 text-lg font-medium mb-2">
                  Your Review
                </label>
                <textarea
                  id="review_text"
                  rows="5"
                  className="shadow-sm border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <label htmlFor="rating" className="block text-gray-700 text-lg font-medium mb-2">
                  Rating (1-5 Stars)
                </label>
                <select
                  id="rating"
                  className="shadow-sm border border-gray-300 rounded-lg w-full p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                  required
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 w-full sm:w-auto"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
        {!isAuthenticated && (
          <div className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-700 text-lg">
            <p>Please <Link to="/login" className="text-blue-600 hover:underline font-semibold">log in</Link> to add a review.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;