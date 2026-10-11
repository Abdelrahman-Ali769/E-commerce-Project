const jwt = require("jsonwebtoken");

/**
 * @desc    Create JWT Token
 * @access  Internal
 */
const CreateToken = (Payload) => {
    return jwt.sign(Payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
    });
};

module.exports =CreateToken ;