import Queue from '../models/Queue.js';
import Shop from '../models/Shop.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Join queue
// @route   POST /api/v1/queues/join
// @access  Private
export const joinQueue = asyncHandler(async (req, res) => {
  const { shopId, service, notes } = req.body;
  const customerId = req.user.id;

  // Get shop
  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(404).json({
      success: false,
      error: 'Shop not found'
    });
  }

  // Check if shop is active
  if (!shop.isActive) {
    return res.status(400).json({
      success: false,
      error: 'Shop is not currently accepting customers'
    });
  }

  // Check if user is already in queue
  const existingInQueue = await Queue.findOne({
    shop: shopId,
    customer: customerId,
    status: { $in: ['waiting', 'in_progress'] }
  });

  if (existingInQueue) {
    return res.status(400).json({
      success: false,
      error: 'You are already in the queue'
    });
  }

  // Get next position
  const lastInQueue = await Queue.findOne({ 
    shop: shopId,
    status: 'waiting' 
  }).sort('-position');
  
  const nextPosition = lastInQueue ? lastInQueue.position + 1 : 1;

  // Check queue size limit
  if (nextPosition > shop.settings.maxQueueSize) {
    return res.status(400).json({
      success: false,
      error: 'Queue is full. Please try again later'
    });
  }

  // Calculate estimated start time
  const estimatedStartTime = new Date();
  const averageWaitTime = shop.averageWaitTime || 15;
  estimatedStartTime.setMinutes(estimatedStartTime.getMinutes() + (averageWaitTime * nextPosition));

  // Create queue entry
  const queue = await Queue.create({
    shop: shopId,
    customer: customerId,
    service,
    position: nextPosition,
    estimatedStartTime,
    notes,
    source: 'app'
  });

  res.status(201).json({
    success: true,
    data: queue
  });
});

// @desc    Get user's current queue status
// @route   GET /api/v1/queues/me
// @access  Private
export const getMyQueue = asyncHandler(async (req, res) => {
  const queues = await Queue.find({ 
    customer: req.user.id,
    status: { $in: ['waiting', 'in_progress'] }
  })
    .populate('shop', 'name address phone')
    .populate('barber', 'name')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: queues
  });
});

// @desc    Leave queue
// @route   PUT /api/v1/queues/:id/leave
// @access  Private
export const leaveQueue = asyncHandler(async (req, res) => {
  const queue = await Queue.findOne({
    _id: req.params.id,
    customer: req.user.id,
    status: { $in: ['waiting', 'in_progress'] }
  });

  if (!queue) {
    return res.status(404).json({
      success: false,
      error: 'Queue entry not found or cannot be cancelled'
    });
  }

  queue.status = 'cancelled';
  await queue.save();

  // TODO: Update positions of others in queue
  await Queue.updateMany(
    {
      shop: queue.shop,
      status: 'waiting',
      position: { $gt: queue.position }
    },
    { $inc: { position: -1 } }
  );

  res.status(200).json({
    success: true,
    data: queue
  });
});

// @desc    Barber: Get shop queue
// @route   GET /api/v1/queues/shop/:shopId
// @access  Private (Barber/Shop Owner)
export const getShopQueue = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  
  // Verify barber works at this shop
  const shop = await Shop.findOne({
    _id: shopId,
    $or: [
      { owner: req.user.id },
      { 'barbers.barber': req.user.id }
    ]
  });

  if (!shop) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to access this shop queue'
    });
  }

  const queues = await Queue.find({ 
    shop: shopId,
    status: { $in: ['waiting', 'in_progress'] }
  })
    .populate('customer', 'name phone')
    .populate('barber', 'name')
    .sort('position');

  res.status(200).json({
    success: true,
    data: queues
  });
});

// @desc    Barber: Call next customer
// @route   PUT /api/v1/queues/shop/:shopId/next
// @access  Private (Barber)
export const callNextCustomer = asyncHandler(async (req, res) => {
  const { shopId } = req.params;
  const barberId = req.user.id;

  // Verify barber works at this shop
  const shop = await Shop.findOne({
    _id: shopId,
    'barbers.barber': barberId,
    'barbers.isActive': true
  });

  if (!shop) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to work at this shop'
    });
  }

  // Find current in-progress customer for this barber
  const currentService = await Queue.findOne({
    shop: shopId,
    barber: barberId,
    status: 'in_progress'
  });

  if (currentService) {
    // Mark current as completed
    currentService.status = 'completed';
    currentService.endTime = new Date();
    await currentService.save();
  }

  // Get next waiting customer
  const nextCustomer = await Queue.findOneAndUpdate(
    {
      shop: shopId,
      status: 'waiting',
      barber: { $exists: false } // Not assigned to any barber yet
    },
    {
      barber: barberId,
      status: 'in_progress',
      actualStartTime: new Date(),
      position: 0
    },
    {
      new: true,
      sort: { position: 1 }
    }
  ).populate('customer', 'name phone');

  if (!nextCustomer) {
    return res.status(404).json({
      success: false,
      error: 'No customers waiting in queue'
    });
  }

  // Update positions of remaining customers
  await Queue.updateMany(
    {
      shop: shopId,
      status: 'waiting',
      position: { $gt: nextCustomer.position }
    },
    { $inc: { position: -1 } }
  );

  // Recalculate estimated times for remaining customers
  const waitingCustomers = await Queue.find({
    shop: shopId,
    status: 'waiting'
  }).sort('position');

  const now = new Date();
  for (let i = 0; i < waitingCustomers.length; i++) {
    const estimatedStart = new Date(now);
    estimatedStart.setMinutes(estimatedStart.getMinutes() + (shop.averageWaitTime * (i + 1)));
    
    waitingCustomers[i].estimatedStartTime = estimatedStart;
    await waitingCustomers[i].save();
  }

  res.status(200).json({
    success: true,
    data: nextCustomer,
    message: 'Next customer called successfully'
  });
});

// @desc    Get queue status for a shop
// @route   GET /api/v1/queues/shop/:shopId/status
// @access  Public
export const getQueueStatus = asyncHandler(async (req, res) => {
  const { shopId } = req.params;

  const shop = await Shop.findById(shopId);
  if (!shop) {
    return res.status(404).json({
      success: false,
      error: 'Shop not found'
    });
  }

  const waitingCount = await Queue.countDocuments({
    shop: shopId,
    status: 'waiting'
  });

  const inProgress = await Queue.find({
    shop: shopId,
    status: 'in_progress'
  }).populate('barber', 'name');

  const averageWaitTime = shop.averageWaitTime || 15;
  const estimatedWait = waitingCount * averageWaitTime;

  res.status(200).json({
    success: true,
    data: {
      shop: {
        id: shop._id,
        name: shop.name,
        averageWaitTime
      },
      queue: {
        waitingCount,
        estimatedWaitMinutes: estimatedWait,
        inProgress,
        maxQueueSize: shop.settings.maxQueueSize
      }
    }
  });
});