const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError.cjs");
const UserModel = require("../Models/UserSchema.cjs");

const CreateToken = (Payload) => {
    return jwt.sign(
        Payload,
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE_TIME,
        }
    );
};

exports.SignUp = asyncHandler(async (req, res, next) => {

    // 1- Create User
    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    });

    // 2- Generate JWT Token
    const token = CreateToken({
        UserId: user._id
    });

    // 3- Send Response
    res.status(201).json({
        data: user,
        token,
    });
});


exports.Login = asyncHandler(async (req, res, next) => {

    // 1- Get email and password
    const { email, password } = req.body;

    // 2- Check if user exists
    const User = await UserModel.findOne({ email });

    // 3- Check password
    if (!User || !(await bcrypt.compare(password, User.password))) {
        return next(
            new ApiError(
                "Incorrect email or password",
                401
            )
        );
    }

    // 4- Generate JWT Token
    const token = CreateToken({
        UserId: User._id
    });

    // 5- Send response to client
    res.status(200).json({
        message: "Login successfully",
        data: User,
        token
    });
});


/**
 * @desc    Protect Routes
 * @route   Middleware
 * @access  Private
 * @note    Extract JWT token from Authorization header
 */
exports.Protect = asyncHandler(async (req, res, next) => {

    let token;

    // 1- Get token from Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2- Check if token exists
    if (!token) {
        return next(
            new ApiError(
                "You are not logged in. Please log in to get access.",
                401
            )
        );
    }

    // 3- Verify token
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
    );
    console.log(decoded);

    // 4- Check if user still exists OR Not Active
    const CurrentUser = await UserModel.findById(decoded.UserId)
    if (!CurrentUser) {
        return next(
            new ApiError(
                "The user belonging to this token no longer exists.",
                401
            )
        );
    }
    if (!CurrentUser.active) {
        return next(
            new ApiError(
                "Your account has been deactivated.",
                401
            )
        );
    }
    next()
});
