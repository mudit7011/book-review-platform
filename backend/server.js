// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Basic home route
app.get('/', (req, res) => {
  res.send('Book Review Platform API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});