
const UserModel = require("../Models/UserSchema.cjs");
const factoryHandler = require("./FactoyHandlers.cjs");
const asyncHandler = require("express-async-handler"); 
const ApiError = require('../utils/ApiError.cjs')
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/ImageMiddleware.cjs");
const { v4: uuidv4 } = require("uuid");

// Upload User Profile Image
exports.uploadUserImage = uploadSingleImage("ProfileImage");

// Resize User Profile Image
exports.ResizeImages = asyncHandler(async (req, res, next) => {
    const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;

    if (!req.file) {
        return next();
    }

    await sharp(req.file.buffer)
        .resize(700, 700)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/Users/${filename}`);

    req.body.ProfileImage = filename;

    next();
});

/**
 * @desc    Get all Users
 * @route   GET /api/users
 * @access  Private
 */
exports.GetAllUser = asyncHandler(async(req,res,next)=>{
    req.filterObj = {active:  true} 
    return factoryHandler.GetAll(UserModel)(req,res,next);
})

/**
 * @desc    Get specific User by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
exports.GetUserByID = factoryHandler.GetOne(UserModel);

/**
 * @desc    Create new User
 * @route   POST /api/users
 * @access  Private
 */
exports.CreateUser = factoryHandler.CreateOne(UserModel);

/**
 * @desc    Update specific User
 * @route   PUT /api/users/:id
 * @access  Private
 */
exports.UpdateUserByID = factoryHandler.UpdateOne(UserModel);

/**
 * @desc    deactivated specific User
 * @route   DELETE  /api/users/:id
 * @access  Private
 */
exports.DeactivateUserByID = asyncHandler(async (req, res, next) => {
    const User = await UserModel.findByIdAndUpdate(req.params.id, { active: false }, { returnDocument: "after" })
    if (!User) {
        return next(new ApiError("User not found", 404));
    }
    res.status(200).json({
        message: "User deactivated successfully",
        data: User
    })

})

