import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from '../models/user.models.js'


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler (async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user is exits : username, email
    // check if images , check for avatar
    // upload them to cloudinary, avatar
    // create user object
    // remove the passowrd and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, password, role, phone, username} = req.body;

    if (
        [fullName,username, email, password, role, phone].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "your field is empyt")
    }

    const existedUser = await User.findOne({email});
    if (existedUser) {
        throw new ApiError(400, 'User is already exists')
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar) {
        throw new ApiError(404, "Avatar file uploa failed")
    }

    const user = await User.create({
        fullName,
        email,
        username,
        password,
        phone,
        role: role || 'user',

    })

    const createdUser = await User.findById(user._id).select("-password ");

    if (!createdUser) {
        throw new ApiError(500, "Register error's")
    }
    return res
    .status(201)
    .json(
        new ApiResponse(201, createdUser, "User register successfully")
    )
});

const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body;
    if (!email){
        throw new ApiError(400, "email is required")
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new ApiError(400, "User is not register")
    }
    const isPasswordVaild = await user.isPasswordCorrect(password)

    if (!isPasswordVaild) {
        throw new ApiError(400, "Password is not correct")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly : true,
        secure: true
    }
    return res
    .status(201)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
        new ApiResponse(201, 
            {user: loggedInUser, accessToken, refreshToken},
             "User logged is successfully")
    )
})

const logoutUser = asyncHandler (async (req, res) => {
    await User.findById(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(201)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json( new ApiResponse(201, {}, "User logged out")
    )
})

const getUser = asyncHandler (async (req, res) => {
        return res
        .status(201)
        .json(new ApiResponse(201, req.user, "current user fetched successfully"))
})

const changePassword = asyncHandler (async (req, res) => {
    const {newPassword, oldPassword} = req.body;

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect ) {
        throw new ApiError(400, "Password is Invaild")
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res
    .status(201)
    .json(new ApiResponse(201, {}, "Password is change Successfully"))
})


export {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    changePassword,
}