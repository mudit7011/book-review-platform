const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

BookSchema.virtual('averageRating', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book',
  justOne: false,
  get: function(reviews) {
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      return (totalRating / reviews.length).toFixed(1);
    }
    return 0;
  }
});

module.exports = mongoose.model('Book', BookSchema);