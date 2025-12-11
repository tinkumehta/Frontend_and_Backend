import Queue from '../models/Queue.js';
import Shop from '../models/Shop.js';

// @desc    Join queue
// @route   POST /api/queues/join
export const joinQueue = async (req, res) => {
  try {
    const { shopId, service } = req.body;
    
    // Get shop
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: 'Shop not found'
      });
    }
    
    // Get last position
    const lastQueue = await Queue.findOne({ shop: shopId, status: 'waiting' })
      .sort('-position');
    
    const nextPosition = lastQueue ? lastQueue.position + 1 : 1;
    
    // Calculate estimated start time
    const estimatedStartTime = new Date();
    estimatedStartTime.setMinutes(estimatedStartTime.getMinutes() + (shop.averageWaitTime * nextPosition));
    
    // Create queue entry
    const queue = await Queue.create({
      shop: shopId,
      customer: req.user.id,
      service,
      position: nextPosition,
      estimatedStartTime,
      status: 'waiting'
    });
    
    res.status(201).json({
      success: true,
      data: queue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get my queue status
// @route   GET /api/queues/me
export const getMyQueue = async (req, res) => {
  try {
    const queues = await Queue.find({ 
      customer: req.user.id,
      status: { $in: ['waiting', 'in_progress'] }
    })
      .populate('shop', 'name address')
      .sort('position');
    
    res.status(200).json({
      success: true,
      data: queues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};