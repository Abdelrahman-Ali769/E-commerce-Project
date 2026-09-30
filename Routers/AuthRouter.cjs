const express = require("express");

const {
    SignUp,Login
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

module.exports = router;