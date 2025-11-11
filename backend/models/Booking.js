const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing_id: {
    type: Number,
    required: true
  },
  listing_name: {
    type: String,
    required: true
  },
  listing_image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994'
  },
  check_in: {
    type: Date,
    required: true
  },
  check_out: {
    type: Date,
    required: true
  },
  guest_name: {
    type: String,
    required: true,
    trim: true
  },
  guest_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  guests: {
    type: Number,
    required: true,
    min: [1, 'At least 1 guest is required']
  },
  total_nights: {
    type: Number,
    required: true,
    min: [1, 'At least 1 night is required']
  },
  price_per_night: {
    type: Number,
    required: true
  },
  total_price: {
    type: Number,
    required: true
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
}, {
  collection: 'bookings',
  timestamps: true
});

// Add indexes for better query performance
bookingSchema.index({ listing_id: 1 });
bookingSchema.index({ guest_email: 1 });
bookingSchema.index({ check_in: 1, check_out: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);