
const UserModel = require("../Models/UserSchema.cjs");
const factoryHandler = require("./FactoyHandlers.cjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.cjs");
const CreateToken = require("../utils/CreateToken.cjs");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlewares/ImageMiddleware.cjs");
const { v4: uuidv4 } = require("uuid");

// ==================== Upload User Profile Image ====================
/**
 * @desc    Upload User Profile Image
 * @route   Middleware
 * @access  Internal
 */
exports.uploadUserImage = uploadSingleImage("ProfileImage");

// ==================== Resize User Profile Image ====================
/**
 * @desc    Resize and save User Profile Image
 * @route   Middleware
 * @access  Internal
 */
exports.ResizeImages = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(700, 700)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/Users/${filename}`);

    req.body.ProfileImage = filename;

    next();
});

// ==================== Get All Users ====================
/**
 * @desc    Get all Users
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.GetAllUser = asyncHandler(async (req, res, next) => {
    req.filterObj = {
        active: true
    };

    return factoryHandler.GetAll(UserModel)(req, res, next);
});

// ==================== Get User By ID ====================
/**
 * @desc    Get specific User by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.GetUserByID = factoryHandler.GetOne(UserModel);

// ==================== Create User ====================
/**
 * @desc    Create new User
 * @route   POST /api/users
 * @access  Private/Admin
 */
exports.CreateUser = factoryHandler.CreateOne(UserModel);

// ==================== Update User By ID ====================
/**
 * @desc    Update specific User
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.UpdateUserByID = factoryHandler.UpdateOne(UserModel);

// ==================== Change User Password By ID ====================
/**
 * @desc    Change specific User password
 * @route   PUT /api/users/change-password/:id
 * @access  Private
 */
exports.ChangePassword = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    user.password = req.body.password;
    user.passwordChangedAt = new Date(Date.now() - 1000);  // Subtract 1 second to handle JWT timestamp comparison correctly

    await user.save();

    res.status(200).json({
        status: "success",
        message: "Password updated successfully"
    });
});

// ==================== Deactivate User ====================
/**
 * @desc    Deactivate specific User
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.DeactivateUserByID = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { returnDocument: "after" }
    );

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    res.status(200).json({
        status: "success",
        message: "User deactivated successfully",
        data: user
    });
});

// ==================== Get Logged User Data ====================
/**
 * @desc    Get logged-in user data
 * @route   GET /api/users/getMe
 * @access  Private
 */
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// ==================== Update Logged User Password ====================
/**
 * @desc    Update logged-in user password
 * @route   PUT /api/users/updateMyPassword
 * @access  Private
 */
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, password } = req.body;

    // 1) Get logged-in user ID automatically from JWT
    const user = await UserModel.findById(req.user._id);

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    // 2) Verify current password
    const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordCorrect) {
        return next(new ApiError("Current password is incorrect", 400));
    }

    // 3) Prevent reusing the current password
    const isSamePassword = await bcrypt.compare(
        password,
        user.password
    );

    if (isSamePassword) {
        return next(
            new ApiError(
                "New password must be different from current password",
                400
            )
        );
    }

    // 4) Update password and timestamp
    user.password = password;
    user.passwordChangedAt = new Date(Date.now() - 1000);

    await user.save();

    // 5) Generate a new JWT
    const token = CreateToken({ UserId: user._id });

    // 6) Exclude sensitive fields from the response
    const userData = user.toObject();

    delete userData.password;
    delete userData.passwordResetCode;
    delete userData.passwordResetExpires;
    delete userData.passwordResetVerified;

    res.status(200).json({
        status: "success",
        message: "Password updated successfully",
        data: userData,
        token
    });
});


/**
 * @desc    Update logged-in user data (without password or role)
 * @route   PUT /api/users/updateMe
 * @access  Private
 */
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    // Prevent updating password or role
    if (req.body.password || req.body.role) {
        return next(
            new ApiError(
                "Use the correct route to update password or role",
                400
            )
        );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedUser) {
        return next(new ApiError("User not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: updatedUser
    });
});

