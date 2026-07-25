const GlobalError = (err, req, res, next) => {
    err.statuscode = statuscode || 500
    err.status = status || "Error"
    res.status(err.statuscode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}
module.exports = GlobalError