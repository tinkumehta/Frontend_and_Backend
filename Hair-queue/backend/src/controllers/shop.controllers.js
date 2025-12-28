import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"; 
import Shop from "../models//shop.models.js";
import { isValidObjectId } from "mongoose";

export const createShop = asyncHandler (async (req, res) => {
    const { name, phone, address, services, longitude, latitude } = req.body;

    // Validate
    if (!name || !longitude || !latitude) {
        throw new ApiError(400, "All fields are required");
    }

    // check if shop with the same name already exists
    const existingShop = await Shop.findOne({
        name,
        owner: req.user._id
    })
    if (existingShop) {
        throw new ApiError(409, "You already have a shop with this name");
    }

    // create shop
    const shop = await Shop.create({
        name,
        owner: req.user._id,
        address,
        phone,
        services,
        location: {
            type: 'Point',
            coordinates : [longitude, latitude]
        }
       
    });

    const createdShop = await Shop.findById(shop._id).populate('owner', 'fullName phone');
    return res
    .status(201)
    .json(
        new ApiResponse(201, createdShop, "Shop created successfully")
    );
})

export const getAllShops = asyncHandler (async (req, res) => {
    const {
        page =1,
        limit =10,
        city, 
        search, 
        minWaitTime,
        maxWaitTime
    } = req.query;

    // Build filter object
    const filter = {isActive : true};

    if (city) {
        filter['address.city'] = {$regex: search, $options: 'i'};
    }

    if (search) {
        filter.$or = [
            {name: {$regex : search, $options : 'i'}},
            {'address.street' : {$regex: search, $options: 'i'}},
            {'address.city' : {$regex: search, $options: 'i'}}
        ];
    }

    if (minWaitTime) {
        filter.averageWaitTime = {$gte: parseInt(minWaitTime)};
    }

    if (maxWaitTime) {
        filter.averageWaitTime = {
            ...filter.averageWaitTime,
            $lte: parseInt(maxWaitTime)
        };
    }

    // skip
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const shop = await Shop.find(filter)
        .populate('owner', 'fullName, phone')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({createdAt: -1});

        const totalShops = await Shop.countDocuments(filter);

        return res
        .status(201)
        .json(
            new ApiResponse(200, {
                shop,
                pagination: {
                    page: parseInt(limit),
                    total: totalShops,
                    pages : Math.ceil(totalShops / parseInt(limit))
                }
            }, "Shop fetched successfully")
        )
})

export const  getMyShops = asyncHandler(async (req, res) => {
    const shops = await Shop.find({owner: req.user._id})
    .populate('owner', 'fullName phone')
    .sort({createdAt: -1});

    return res
    .status(201).json(
        new ApiResponse(201, shops, "Your shops fetched Successfully")
    )
})

export const getNearbyShops = asyncHandler (async (req, res) => {
    const {latitude, longitude, distance = 5000} = req.query; // radius in meters

    if (!latitude || !longitude) {
        throw new ApiError(404, "Latitude and longitude are required");
    }

    // for now, just get all shops
    // later you can add geospatial indexing for location based search
    const shop = await Shop.find({
        location : {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [Number(longitude), Number(latitude)]
                },
                $maxDistance: Number(distance)
            }
        },
        isActive : true
    })

    return res.status(201).json(new ApiResponse(201, shop, "Nearby shops fetched successfull"))
})

// GET SINGEL SHOP
export const getShopById = asyncHandler (async (req, res) => {
    const {shopId} = req.params;
    if (!isValidObjectId(shopId)) {
        throw new ApiError(400, "Invalid shop id")
    }

    const shop = await Shop.findById(shopId).populate('owner', 'fullName phone');

    if (!shop) {
        throw new ApiError(404, "Shop id not found")
    }
    return res.status(201).json(
        new ApiResponse (201, shop, "Shop fetch successfully")
    )
})

export const updateShop = asyncHandler (async (req, res) => {
    const {shopId} = req.params;
    const {name, address, phone, services, averageWaitTime, isActive} = req.body;

    if (!isValidObjectId(shopId)) {
        throw new ApiError(404, "shop id is not corect")
    }

    // find shop
    const shop = await Shop.findById(shopId);

    if (!shop) {
        throw new ApiError(404, "Shop not found")
    }

    if (shop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(404, "You are not authorized to update this shop")
    }

    // update fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (address !== undefined) updateFields.address = address;
    if (phone !== undefined) updateFields.phone = phone;
    if (services !== undefined) updateFields.services = services;
    if (averageWaitTime !== undefined)  updateFields.averageWaitTime = averageWaitTime;
    if (isActive !== undefined) updateFields.isActive = isActive;

    // update shop 
    const updateShop = await Shop.findByIdAndUpdate(
        shopId,
        {$set : updateFields},
        {new : true,
            runValidators: true
        }
    ).populate('owner', 'fullName , email')

    return res
    .status(201).json(new ApiResponse(201, updateShop, "Shop updated successfully"))
})

export const toggleShopStatus = asyncHandler(async (req, res) => {
    const {shopId} = req.params;
    if (!isValidObjectId(shopId)) {
        throw new ApiError(404, "Shop not found")
    }
    const shop = await Shop.findById(shopId);

    shop.isActive = !shop.isActive;
    await shop.save();
    return res.status(201).json({isActive : shop.isActive});
})
