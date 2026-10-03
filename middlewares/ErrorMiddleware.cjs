const ApiError = require("../utils/ApiError.cjs");

const handleJwtInvalidSignature = () =>
    new ApiError("Invalid token, please login again.", 401);

const handleJwtExpired = () =>
    new ApiError("Your token has expired, please login again.", 401);

const GlobalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.status = "fail";
    }

    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }

    if (process.env.NODE_ENV === "production") {
        if (err.name === "JsonWebTokenError") {
            err = handleJwtInvalidSignature();
        }

        if (err.name === "TokenExpiredError") {
            err = handleJwtExpired();
        }

        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
};

module.exports = GlobalError;
