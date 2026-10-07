const express = require("express");
const {
    SignUp, Login,ForgotPassword
} = require("../Controllers/AuthController.cjs");

const {
    SignUpValidator, LoginValidator
} = require("../utils/validators/AuthValidator.cjs");

const router = express.Router();

// Sign Up
router.post(
    "/signup",
    SignUpValidator,
    SignUp
);

// Login
router.post(
    "/Login",
    LoginValidator,
    Login
);


// ForgotPassword
router.post(
    "/ForgotPassword",
    ForgotPassword
);
module.exports = router;