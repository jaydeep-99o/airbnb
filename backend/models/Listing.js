const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  host_id: {
    type: Number,
    required: true
  },
  host_name: {
    type: String,
    required: true
  },
  neighbourhood_group: {
    type: String,
    required: true
  },
  neighbourhood: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  room_type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  minimum_nights: {
    type: Number,
    default: 1
  },
  number_of_reviews: {
    type: Number,
    default: 0
  },
  last_review: {
    type: Date
  },
  reviews_per_month: {
    type: Number,
    default: 0
  },
  calculated_host_listings_count: {
    type: Number,
    default: 1
  },
  availability_365: {
    type: Number,
    default: 365
  }
}, {
  collection: 'booking',  // Use your existing collection name
  timestamps: false,
  strict: false  // Allow fields not in schema
});

module.exports = mongoose.model('Listing', listingSchema);