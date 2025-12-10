import Shop from '../models/Shop.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all shops
// @route   GET /api/v1/shops
// @access  Public
export const getShops = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 5000, page = 1, limit = 10 } = req.query;
  let query = { isActive: true };

  // If coordinates provided, add geospatial query
  if (lat && lng) {
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: parseInt(radius)
      }
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const shops = await Shop.find(query)
    .populate('owner', 'name')
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Shop.countDocuments(query);

  res.status(200).json({
    success: true,
    count: shops.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    },
    data: shops
  });
});

// @desc    Get single shop
// @route   GET /api/v1/shops/:id
// @access  Public
export const getShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id)
    .populate('owner', 'name email phone')
    .populate('barbers.barber', 'name');

  if (!shop) {
    return res.status(404).json({
      success: false,
      error: 'Shop not found'
    });
  }

  // Get current queue status
  const Queue = (await import('../models/Queue.js')).default;
  const waitingCount = await Queue.countDocuments({
    shop: shop._id,
    status: 'waiting'
  });

  const shopWithQueue = {
    ...shop.toObject(),
    currentQueue: {
      waitingCount,
      estimatedWait: waitingCount * (shop.averageWaitTime || 15)
    }
  };

  res.status(200).json({
    success: true,
    data: shopWithQueue
  });
});

// @desc    Create shop
// @route   POST /api/v1/shops
// @access  Private (Shop Owner/Admin)
export const createShop = asyncHandler(async (req, res) => {
  req.body.owner = req.user.id;

  // Check if user already owns a shop
  const existingShop = await Shop.findOne({ owner: req.user.id });
  if (existingShop && req.user.role !== 'admin') {
    return res.status(400).json({
      success: false,
      error: 'You already own a shop'
    });
  }

  const shop = await Shop.create(req.body);

  res.status(201).json({
    success: true,
    data: shop
  });
});

// @desc    Update shop
// @route   PUT /api/v1/shops/:id
// @access  Private (Shop Owner/Admin)
export const updateShop = asyncHandler(async (req, res) => {
  let shop = await Shop.findById(req.params.id);

  if (!shop) {
    return res.status(404).json({
      success: false,
      error: 'Shop not found'
    });
  }

  // Check ownership
  if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this shop'
    });
  }

  shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: shop
  });
});

// @desc    Delete shop
// @route   DELETE /api/v1/shops/:id
// @access  Private (Shop Owner/Admin)
export const deleteShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return res.status(404).json({
      success: false,
      error: 'Shop not found'
    });
  }

  // Check ownership
  if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this shop'
    });
  }

  // Soft delete
  shop.isActive = false;
  await shop.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add barber to shop
// @route   POST /api/v1/shops/:id/barbers
// @access  Private (Shop Owner/Admin)
export const addBarber = asyncHandler(async (req, res) => {
  const { barberId } = req.body;

  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return res.status(404).json({
      success: false,
      error: 'Shop not found'
    });
  }

  // Check ownership
  if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to modify this shop'
    });
  }

  // Check if barber already added
  const existingBarber = shop.barbers.find(b => b.barber.toString() === barberId);
  if (existingBarber) {
    return res.status(400).json({
      success: false,
      error: 'Barber already added to this shop'
    });
  }

  shop.barbers.push({
    barber: barberId,
    isActive: true
  });

  await shop.save();

  res.status(200).json({
    success: true,
    data: shop
  });
});