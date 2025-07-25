const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Book = require('../models/Book');
const Review = require('../models/Review');
const { body, validationResult } = require('express-validator');

// @route   POST api/books
// @desc    Add a new book
router.post(
  '/',
  [
    auth,
    body('title', 'Title is required').not().isEmpty(),
    body('author', 'Author is required').not().isEmpty(),
    body('genre', 'Genre is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, author, genre, imageUrl,description } = req.body; 
    try {
      const newBook = new Book({
        title,
        author,
        genre,
        imageUrl,
        description,
        addedBy: req.user.id
      });
      const book = await newBook.save();
      res.json(book);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/books
// @desc    Get all books with pagination and filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.genre) {
      query.genre = new RegExp(req.query.genre, 'i'); 
    }
    if (req.query.author) {
      query.author = new RegExp(req.query.author, 'i');
    }

    const books = await Book.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalBooks = await Book.countDocuments(query);

    const booksWithAvgRating = await Promise.all(books.map(async (book) => {
      const reviews = await Review.find({ book: book._id });
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
      return { ...book.toObject(), averageRating: parseFloat(averageRating) };
    }));

    res.json({
      books: booksWithAvgRating,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   GET api/books/:id
// @desc    Get a single book by ID with its reviews and average rating
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    const reviews = await Review.find({ book: req.params.id }).populate('reviewer', 'username');

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({ book, reviews, averageRating: parseFloat(averageRating) });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server error');
  }
});


// @route   POST api/books/:id/reviews
// @desc    Add a review to a book
// @access  Private
router.post(
  '/:id/reviews',
  [
    auth, 
    body('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('comment', 'Comment cannot be empty').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { rating, comment } = req.body; 
    const bookId = req.params.id; 
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ msg: 'Book not found' });
      }
      const newReview = new Review({
        book: bookId,
        reviewer: req.user.id,
        rating,
        comment
      });
      const review = await newReview.save();
      res.json(review); 
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Book not found' });
      }
      res.status(500).send('Server error');
    }
  }
);


// @route   GET api/books/:id/reviews
// @desc    Get all reviews for a specific book
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.id }).populate('reviewer', 'username');
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this book' });
    }

    await Review.deleteMany({ book: req.params.id });

    await Book.deleteOne({ _id: req.params.id }); 
    res.json({ msg: 'Book and associated reviews removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;