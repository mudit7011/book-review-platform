const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book', 
    required: true
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);