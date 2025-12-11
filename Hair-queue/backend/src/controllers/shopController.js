import Shop from '../models/Shop.js';

// @desc    Get all shops
// @route   GET /api/shops
export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true })
      .populate('owner', 'name email');
    
    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
export const getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: 'Shop not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};