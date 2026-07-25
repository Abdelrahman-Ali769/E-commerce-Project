
class ApiError extends Error {

    constructor(message, statuscode) {
        this.statuscode = statuscode
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
        this.isOperational = true
        this.captureStackTrace = (this, this.constructor)
    }
}
module.exports = ApiError