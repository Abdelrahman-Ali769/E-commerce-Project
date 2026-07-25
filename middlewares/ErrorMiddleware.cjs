const GlobalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "Error"
    if (err.name == "ValidationError") {
        err.statusCode = 400
        err.status = "Fail"
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}
module.exports = GlobalError