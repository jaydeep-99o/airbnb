const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/airbnb';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connected successfully to database: airbnb'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Import Routes
const listingRoutes = require('./routes/listings');
const bookingRoutes = require('./routes/bookings');

// Use Routes
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Airbnb Booking API',
    endpoints: {
      listings: '/api/listings',
      bookings: '/api/bookings'
    }
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});