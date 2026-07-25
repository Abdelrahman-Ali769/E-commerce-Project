// class ApiError extends Error {
//     constructor(message, statusCode) {
//         // استدعاء الـ constructor الخاص بـ Error
//         super(message);

//         // حفظ الـ Status Code
//         this.statusCode = statusCode;

//         // تحديد نوع الخطأ
//         // لو 4xx يبقى Fail
//         // لو 5xx يبقى Error
//         this.status = `${statusCode}`.startsWith("4")
//             ? "fail"
//             : "error";

//         // الخطأ متوقع (Operational Error)
//         this.isOperational = true;

//         // الاحتفاظ بمكان حدوث الخطأ
//         Error.captureStackTrace(this, this.constructor);
//     }
// }

// module.exports = ApiError;
class ApiError extends Error {

    constructor(message, statuscode) {
        this.statuscode = statuscode
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
        this.isOperational = true
        this.captureStackTrace = (this, this.constructor)
    }
}
module.exports = ApiError