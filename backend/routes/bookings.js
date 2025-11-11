const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      listing_id,
      check_in,
      check_out,
      guest_name,
      guest_email,
      guests
    } = req.body;

    // Validation - Check all required fields
    if (!listing_id || !check_in || !check_out || !guest_name || !guest_email || !guests) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['listing_id', 'check_in', 'check_out', 'guest_name', 'guest_email', 'guests']
      });
    }

    // Find the listing
    const listing = await Listing.findOne({ id: Number(listing_id) });

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: `Listing with ID ${listing_id} not found`
      });
    }

    // Parse and validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate check-in date
    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        error: 'Check-in date cannot be in the past'
      });
    }

    // Validate check-out date
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        error: 'Check-out date must be after check-in date'
      });
    }

    // Calculate total nights
    const total_nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Check minimum nights requirement
    if (total_nights < listing.minimum_nights) {
      return res.status(400).json({
        success: false,
        error: `This property requires a minimum stay of ${listing.minimum_nights} night(s). You selected ${total_nights} night(s).`
      });
    }

    // Calculate total price
    const total_price = listing.price * total_nights;

    // Create new booking
    const booking = new Booking({
      listing_id: listing.id,
      listing_name: listing.name,
      listing_image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      check_in: checkInDate,
      check_out: checkOutDate,
      guest_name: guest_name.trim(),
      guest_email: guest_email.trim().toLowerCase(),
      guests: Number(guests),
      total_nights,
      price_per_night: listing.price,
      total_price,
      status: 'confirmed'
    });

    // Save booking to database
    await booking.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: error.message
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get a single booking by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    
    // Handle invalid MongoDB ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking',
      message: error.message
    });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings or filter by guest email
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { guest_email, status, limit = 50, page = 1 } = req.query;

    // Build query
    let query = {};
    
    if (guest_email) {
      query.guest_email = guest_email.trim().toLowerCase();
    }

    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch bookings
    const bookings = await Booking.find(query)
      .limit(Number(limit))
      .skip(skip)
      .sort({ booking_date: -1 });

    // Get total count
    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
      message: error.message
    });
  }
});

// @route   PATCH /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Public
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }

    // Update status
    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking',
      message: error.message
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete booking',
      message: error.message
    });
  }
});

module.exports = router;