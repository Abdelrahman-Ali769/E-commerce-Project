const ApiError = require("../utils/ApiError.cjs");
const multer = require("multer");


// const MulterStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "uploads/categories");
//     },
//     filename: function (req, file, cb) {
    //         cb(null, filename);
//         const ext = file.mimetype.split("/")[1];
//         const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     }
// });

exports.uploadSingleImage =(Filedname)=>{
    const MulterStorage = multer.memoryStorage();
    
    const MulterFilter = function (req, file, cb) {
        // Check image extension
        const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const fileExtension = file.originalname
            .split(".")
            .pop()
            .toLowerCase();
    
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new ApiError("Only Images Allowed", 400), false);
        }
    };
    
    const upload = multer({
        storage: MulterStorage,
        fileFilter: MulterFilter
    });
    return upload.single(Filedname);
}