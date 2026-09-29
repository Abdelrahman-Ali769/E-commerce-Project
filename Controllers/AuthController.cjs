const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../Models/UserSchema.cjs");

exports.SignUp = asyncHandler(async (req, res, next) => {

    // 1- Create User
    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    });

    // 2- Generate JWT Token
    const token = jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE_TIME,
        }
    );

    // 3- Send Response
    res.status(201).json({
        data: user,
        token,
    });
});