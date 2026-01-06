import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import Shop from "../models/shop.models.js"; // Fixed path (double // removed)
import mongoose from "mongoose"; // Use mongoose.isValidObjectId

export const createShop = asyncHandler(async (req, res) => {
    const { name, phone, address, services, longitude, latitude } = req.body;

    // Validation
    if (!name || !phone || !address) {
        throw new ApiError(400, "Name, phone, and address are required");
    }

    // Check if shop with the same name already exists
    const existingShop = await Shop.findOne({
        name,
        owner: req.user._id
    });
    
    if (existingShop) {
        throw new ApiError(409, "You already have a shop with this name");
    }

    // Create shop
    const shop = await Shop.create({
        name,
        owner: req.user._id,
        address,
        phone,
        services: services || [],
        location: longitude && latitude ? {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
        } : undefined
    });

    const createdShop = await Shop.findById(shop._id).populate('owner', 'fullName phone');
    
    return res
    .status(201)
    .json(
        new ApiResponse(201, createdShop, "Shop created successfully")
    );
});

export const getAllShops = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        city, 
        search, 
        minWaitTime,
        maxWaitTime
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (city) {
        filter['address.city'] = { $regex: city, $options: 'i' }; // Fixed: use city variable, not search
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { 'address.street': { $regex: search, $options: 'i' } },
            { 'address.city': { $regex: search, $options: 'i' } }
        ];
    }

    if (minWaitTime) {
        filter.averageWaitTime = { $gte: parseInt(minWaitTime) };
    }

    if (maxWaitTime) {
        filter.averageWaitTime = { 
            ...filter.averageWaitTime,
            $lte: parseInt(maxWaitTime)
        };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const shops = await Shop.find(filter) // Fixed variable name from shop to shops
        .populate('owner', 'fullName phone') // Fixed: removed comma
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const totalShops = await Shop.countDocuments(filter);

    return res
    .status(200) // Fixed: Changed from 201 to 200
    .json(
        new ApiResponse(200, {
            shops, // Fixed variable name
            pagination: {
                page: parseInt(page), // Fixed: was limit
                limit: parseInt(limit),
                total: totalShops,
                pages: Math.ceil(totalShops / parseInt(limit))
            }
        }, "Shops fetched successfully")
    );
});

export const getMyShops = asyncHandler(async (req, res) => {
    const shops = await Shop.find({ owner: req.user._id })
        .populate('owner', 'fullName phone')
        .sort({ createdAt: -1 });

    return res
    .status(200) // Fixed: Changed from 201 to 200
    .json(
        new ApiResponse(200, shops, "Your shops fetched successfully")
    );
});

export const getNearbyShops = asyncHandler(async (req, res) => {
    const { latitude, longitude, distance = 5000 } = req.query;

    if (!latitude || !longitude) {
        throw new ApiError(400, "Latitude and longitude are required"); // Fixed: 404 to 400
    }

    const shops = await Shop.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                $maxDistance: parseInt(distance)
            }
        },
        isActive: true
    }).populate('owner', 'fullName phone');

    return res.status(200).json( // Fixed: 201 to 200
        new ApiResponse(200, shops, "Nearby shops fetched successfully")
    );
});

export const getShopById = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(shopId)) { // Fixed: Use mongoose.isValidObjectId
        throw new ApiError(400, "Invalid shop id");
    }

    const shop = await Shop.findById(shopId)
        .populate('owner', 'fullName phone');

    if (!shop) {
        throw new ApiError(404, "Shop not found");
    }
    
    return res.status(200).json( // Fixed: 201 to 200
        new ApiResponse(200, shop, "Shop fetched successfully")
    );
});

export const updateShop = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    const { name, address, phone, services, averageWaitTime, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
        throw new ApiError(400, "Invalid shop id"); // Fixed error code
    }

    // Find shop
    const shop = await Shop.findById(shopId);

    if (!shop) {
        throw new ApiError(404, "Shop not found");
    }

    // Check authorization
    if (shop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You are not authorized to update this shop"); // Fixed: 404 to 403
    }

    // Update fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (address !== undefined) updateFields.address = address;
    if (phone !== undefined) updateFields.phone = phone;
    if (services !== undefined) updateFields.services = services;
    if (averageWaitTime !== undefined) updateFields.averageWaitTime = averageWaitTime;
    if (isActive !== undefined) updateFields.isActive = isActive;

    // Update shop
    const updatedShop = await Shop.findByIdAndUpdate(
        shopId,
        { $set: updateFields },
        { 
            new: true,
            runValidators: true 
        }
    ).populate('owner', 'fullName email'); // Fixed: removed comma

    return res.status(200).json( // Fixed: 201 to 200
        new ApiResponse(200, updatedShop, "Shop updated successfully")
    );
});

export const toggleShopStatus = asyncHandler(async (req, res) => {
    const { shopId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
        throw new ApiError(400, "Invalid shop id");
    }
    
    const shop = await Shop.findById(shopId);
    
    if (!shop) {
        throw new ApiError(404, "Shop not found");
    }

    // Check authorization
    if (shop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You are not authorized to update this shop");
    }

    shop.isActive = !shop.isActive;
    await shop.save();
    
    return res.status(200).json( // Fixed: 201 to 200
        new ApiResponse(200, { isActive: shop.isActive }, "Shop status updated")
    );
});