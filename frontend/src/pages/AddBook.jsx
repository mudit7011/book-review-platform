import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Include description in the API call
      await API.post('/books', { title, author, genre, imageUrl, description }); 

      setSuccess('Book added successfully! Redirecting...');
      setTitle('');
      setAuthor('');
      setGenre('');
      setImageUrl('');
      setDescription(''); // Clear description field after submission
      setTimeout(() => navigate('/books'), 1500);
    } catch (err) {
      console.error('Error adding book:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
            Add New Book
          </h1>
          {/* Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{success}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-5">
              <label htmlFor="title" className="block text-gray-700 text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Hitchhiker's Guide to the Galaxy"
                required
              />
            </div>
            {/* Author */}
            <div className="mb-5">
              <label htmlFor="author" className="block text-gray-700 text-sm font-medium mb-2">
                Author
              </label>
              <input
                type="text"
                id="author"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Douglas Adams"
                required
              />
            </div>
            {/* Genre */}
            <div className="mb-5">
              <label htmlFor="genre" className="block text-gray-700 text-sm font-medium mb-2">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Science Fiction, Comedy"
                required
              />
            </div>
            {/* Image URL */}
            <div className="mb-7">
              <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-medium mb-2">
                Book Cover Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/your-book-cover.jpg"
              />
              {imageUrl && ( // Show preview if URL is entered
                <div className="mt-4 text-center">
                  <p className="text-gray-600 text-sm mb-2">Image Preview:</p>
                  <img
                    src={imageUrl}
                    alt="Cover Preview"
                    className="max-w-xs max-h-48 mx-auto border border-gray-300 rounded-lg shadow-md object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150x200?text=Invalid+URL"; }}
                  />
                </div>
              )}
            </div>

            {/* New: Description Textarea */}
            <div className="mb-7">
              <label htmlFor="description" className="block text-gray-700 text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed summary or overview of the book..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Book...' : 'Add Book'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;