const express = require("express");

const {
    SignUp
} = require("../Controllers/AuthController.cjs");

const {
    SignUpValidator
} = require("../utils/validators/AuthValidator.cjs");

const router = express.Router();

// Sign Up
router.post(
    "/signup",
    SignUpValidator,
    SignUp
);

module.exports = router;