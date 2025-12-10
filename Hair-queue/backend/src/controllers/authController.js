import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import asyncHandler from "../middleware/asyncHandler.js";

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        {id}, 
        process.env.JWT_SECRET,
        {
            expiresIn : process.env.JWT_EXPIRE
        }
    );
};

export const register = asyncHandler (async (req, res) => {
    const {name, email, phone, password, role} = req.body;

    // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists with this email'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email, 
    phone, 
    password,
     role: role || 'user'
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success : true,
    data: {
        token,
        user : {
            id : user._id,
            name : user.name,
            email: user.email,
            phone : user.phone,
            role : user.role
        }
    }
  });
});

export const login = asyncHandler (async (req, res ) => {
    const {email, password} = req.body;

    // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password'
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Create token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    }
  });

})

// get 
export const getMe = asyncHandler (async (req, res) => {
    const user = await User.findById(user._id);

    res.status(201).json({
        success : true,
         data : user
    });
});

export const updateDetails = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(req.body.currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Password is incorrect'
    });
  }

  user.password = req.body.newPassword;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    }
  });
});

