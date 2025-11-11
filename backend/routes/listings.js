const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// PUT FILTER ROUTES FIRST (before /:id)
// GET unique neighbourhoods
router.get('/filters/neighbourhoods', async (req, res) => {
  try {
    const neighbourhoods = await Listing.distinct('neighbourhood');
    const neighbourhoodGroups = await Listing.distinct('neighbourhood_group');

    res.json({
      success: true,
      data: {
        neighbourhoods: neighbourhoods.sort(),
        neighbourhood_groups: neighbourhoodGroups.sort()
      }
    });
  } catch (error) {
    console.error('Error fetching neighbourhoods:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching neighbourhoods',
      message: error.message
    });
  }
});

// GET room types
router.get('/filters/room-types', async (req, res) => {
  try {
    const roomTypes = await Listing.distinct('room_type');

    res.json({
      success: true,
      data: roomTypes
    });
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching room types',
      message: error.message
    });
  }
});

// GET single listing by ID - MOVE THIS AFTER FILTER ROUTES
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findOne({ id: Number(req.params.id) });

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      });
    }

    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching listing',
      message: error.message
    });
  }
});

// GET all listings with filters - KEEP THIS LAST
router.get('/', async (req, res) => {
  try {
    const {
      neighbourhood,
      neighbourhood_group,
      room_type,
      min_price,
      max_price,
      search,
      limit = 20,
      page = 1
    } = req.query;

    // Build query object
    let query = {};

    if (neighbourhood) {
      query.neighbourhood = neighbourhood;
    }

    if (neighbourhood_group) {
      query.neighbourhood_group = neighbourhood_group;
    }

    if (room_type) {
      query.room_type = room_type;
    }

    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = Number(min_price);
      if (max_price) query.price.$lte = Number(max_price);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const listings = await Listing.find(query)
      .limit(Number(limit))
      .skip(skip)
      .sort({ price: 1 });

    // Get total count for pagination
    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      data: listings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching listings',
      message: error.message
    });
  }
});

module.exports = router;