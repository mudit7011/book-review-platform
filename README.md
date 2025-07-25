# Book Review MERN Stack Application

## Project Overview

This is a full-stack web application designed for users to discover, add, and review books. It provides a platform for book enthusiasts to share their opinions and explore a rich collection of literary works. Built with the MERN (MongoDB, Express.js, React, Node.js) stack, it offers a modern, responsive user interface and robust backend functionalities.

## Deployed Link

 ```bash
    https://https://book-review-platform-kohl.vercel.app/
    ```


## Features

*   **User Authentication:** Secure user registration and login.
*   **Book Management:**
    *   Add new books with details like title, author, genre, **description**, and cover image URL.
    *   View a list of all books with average ratings.
    *   Detailed view for each book with full information and reviews.
    *   Delete books (only by the user who added them).
*   **Review System:**
    *   Add reviews to books, including a star rating and text comment.
    *   View all reviews for a specific book.
    *   Average rating calculation displayed for each book.
*   **Dynamic Content Handling:**
    *   Book covers displayed from hosted URLs (**Cloudinary recommended for reliable hosting**).
    *   Interactive star rating visualization.
*   **Responsive UI:** Styled with Tailwind CSS for a mobile-first and adaptive experience.

## Technologies Used

### Frontend
*   **React:** JavaScript library for UI development.
*   **React Router DOM:** For client-side routing.
*   **Axios:** HTTP client for API requests.
*   **jwt-decode:** For decoding JSON Web Tokens on the client.
*   **Tailwind CSS:** Utility-first CSS framework for styling.

### Backend
*   **Node.js:** JavaScript runtime.
*   **Express.js:** Web application framework for Node.js.
*   **MongoDB:** NoSQL database.
*   **Mongoose:** ODM for MongoDB.
*   **JSON Web Tokens (JWT):** For secure authentication.
*   **Bcrypt.js:** For password hashing.
*   **Express Validator:** For request data validation.
*   **Dotenv:** For environment variable management.

## Getting Started: Local Development Setup

Follow these steps precisely to get the application running on your local machine.

### Prerequisites

*   **Node.js:** Ensure you have the latest LTS version installed.
*   **MongoDB:** A running MongoDB instance (either locally installed or a cloud service like MongoDB Atlas).

### Installation & Run Steps (All in One Go)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mudit7011/book-review-platform.git
    cd book-review-platform
    ```

2.  **Navigate to the `backend` directory and install dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Configure Backend Environment Variables:**
    Create a file named `.env` in the `backend` directory (i.e., `book-review-platform/backend/.env`) and add the following:
    ```env
    MONGO_URI=your_mongodb_connection_string_here
    JWT_SECRET=a_very_strong_and_random_secret_key_for_jwt_signing
    PORT=5000
    ```
    *   **`MONGO_URI`**: Get this from your MongoDB Atlas dashboard or use `mongodb://localhost:27017/bookreviewdb` for a local instance.

4.  **Start the Backend Server:**
    From within the `backend` directory:
    ```bash
    npm start
    ```
    The backend server will start on `http://localhost:3000` (or your specified `PORT`). Keep this terminal running.

5.  **Navigate to the `frontend` directory and install dependencies:**
    Open a **new terminal window** and run:
    ```bash
    cd ../frontend 
    npm install
    ```

6.  **Start the Frontend Development Server:**
    From within the `frontend` directory:
    ```bash
    npm run dev
    ```
    The frontend application will typically open in your browser at `http://localhost:5173` (default for Vite)

You should now have both your backend and frontend running, and the application will be accessible in your browser!

## Key API Endpoints

The backend exposes the following primary API endpoints:

### User Authentication
*   `POST /api/auth/signup`: Register a new user (`{ username, email, password }`).
*   `POST /api/auth/login`: Log in a user (`{ email, password }`).
*   `GET /api/auth/me`: Get current authenticated user's details (requires JWT in `x-auth-token` header).

### Books
*   `POST /api/books`: Add a new book (requires authentication).
    *   Body: `{ title, author, genre, description (optional), imageUrl (optional) }`
*   `GET /api/books`: Get all books (supports pagination `?page=X&limit=Y` and filters `?genre=GenreName&author=AuthorName`).
*   `GET /api/books/:id`: Get details for a single book, including its reviews and average rating.
*   `DELETE /api/books/:id`: Delete a book (requires authentication, only original `addedBy` user can delete).

### Reviews
*   `POST /api/books/:id/reviews`: Add a review to a specific book (requires authentication).
    *   Body: `{ rating, comment }`
*   `GET /api/books/:id/reviews`: Get all reviews for a specific book.

