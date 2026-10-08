const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError.cjs");
const UserModel = require("../Models/UserSchema.cjs");
const sendEmail = require("../utils/SendEmail.cjs");


/**
 * @desc    Create JWT Token
 * @access  Internal
 */
const CreateToken = (Payload) => {
    return jwt.sign(
        Payload,
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE_TIME,
        }
    );
};


/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
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


/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
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
 * @desc    Protect routes using JWT authentication
 * @route   Middleware
 * @access  Private
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

    // 4- Check if user still exists
    const CurrentUser = await UserModel.findById(decoded.UserId);

    if (!CurrentUser) {
        return next(
            new ApiError(
                "The user belonging to this token no longer exists.",
                401
            )
        );
    }

    // 5- Check if user is active
    if (!CurrentUser.active) {
        return next(
            new ApiError(
                "Your account has been deactivated.",
                401
            )
        );
    }

    // 6- Check if password was changed after token creation
    if (CurrentUser.passwordChangedAt) {

        const passwordChangedTimestamp = parseInt(
            CurrentUser.passwordChangedAt.getTime() / 1000,
            10
        );

        if (passwordChangedTimestamp > decoded.iat) {
            return next(
                new ApiError(
                    "Your password has been changed. Please login again.",
                    401
                )
            );
        }
    }

    // 7- Store current user in request
    req.user = CurrentUser;

    next();
});


/**
 * @desc    Authorize users based on their roles
 * @route   Middleware
 * @access  Private
 */
exports.IsAllowTo = (...roles) => {

    return asyncHandler(async (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    "You are not allowed to access this route",
                    403
                )
            );
        }

        next();
    });
};


exports.ForgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const User = await UserModel.findOne({ email })

    if (!User) {
        return next(
            new ApiError(`There is no user with this email ${email}`, 404)
        );
    }
    const resetCode = crypto.randomInt(100000, 1000000).toString();

    // hash Reset code
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");

    User.passwordResetCode = hashedResetCode
    // Code expires af
    // ter 10 minutes
    User.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    User.passwordResetVerified = false;

    await User.save({ validateBeforeSave: false });

     // 5) Send reset code via email
    const message = `Hi ${User.name},

We received a request to reset the password on your E-shop Account.

Your password reset code is: ${resetCode}

This code is valid for 10 minutes.

Enter this code to reset your password.`;

    try {
        await sendEmail({
            to: User.email,
            subject: "Your password reset code (valid for 10 min)",
            message,
        });
    } catch (err) {

    console.log("EMAIL ERROR:", err);

    // Remove reset code if email failed
    User.passwordResetCode = undefined;
    User.passwordResetExpires = undefined;
    User.passwordResetVerified = undefined;

    await User.save();

    return next(
        new ApiError(
            "There is an error in sending email",
            500
        )
    );
}

    res.status(200).json({
        status: "Success",
        message: "Reset code sent to email",
    });
});
