// require mongoose
const mongoose = require('mongoose');

// mongoose connection
mongoose.connect('mongodb://localhost/reviews');

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// mongoose schema

const ReviewSchema = mongoose.Schema({
  review_id: Number,
  product_id: Number,
  rating: Number,
  date: Date,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: Number,
  photos: [{
    id: Number,
    url: String,
  }],
});

const ReviewsMetaSchema = mongoose.Schema({
  product_id: Number,
  ratings: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number,
  },
  recommended: {
    false: Number,
    true: Number,
  },
  characteristics: [{
    name: String,
    id: Number,
    value: Number,
  }],
});

// mongoose model
const Review = mongoose.model('Review', ReviewSchema);
const ReviewsMeta = mongoose.model('ReviewsMeta', ReviewsMetaSchema);

// export
module.exports.Review = Review;
module.exports.ReviewsMeta = ReviewsMeta;
