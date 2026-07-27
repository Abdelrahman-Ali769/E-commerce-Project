const GlobalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "Error"
    const SendErrorDev = (err, res) => {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        })
    }
    const SendErrorProd = (err, res) => {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }

if (err.name === "ValidationError"){      
        err.statusCode = 400
        err.status = "Fail"
    }
    if (process.env.NODE_ENV === 'development') {
        SendErrorDev(err, res);
    } else {
        SendErrorProd(err, res)
    }
}
module.exports = GlobalError