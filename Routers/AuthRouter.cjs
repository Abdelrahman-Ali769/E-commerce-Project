const express = require("express");
const {
    SignUp, Login, ForgotPassword, verifyPassResetCode,resetPassword
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

// verifyPassResetCode 
router.post(
    "/VerifyResetCode",
    verifyPassResetCode
);


// resetPassword 
router.put(
    "/resetPassword",
    resetPassword
);

module.exports = router;