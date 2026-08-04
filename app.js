process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION!  Shutting down...");
    console.error(err);
    process.exit(1);
});

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const ApiError = require('./utils/ApiError.cjs');
const CategoryRouter = require('./Routers/CategoryRouter.cjs');
const SubCategoryRouter = require('./Routers/SubCategoryRouter.cjs');
const GlobalError = require('./middlewares/ErrorMiddleware.cjs');

const app = express();
app.use(express.json());
const Uri = process.env.MONGO_URI;
const Port = process.env.PORT || 3000;

let server; 

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
    console.error(`UNHANDLED REJECTION!  ${err.name} : ${err.message}`);
    // لو السيرفر قام واشتغل فعلاً، اقفله الأول بشكل نظيف قبل ما تقفل التطبيق
    if (server) {
        server.close(() => {
            console.error("Server shutting down...");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});
// Mount Routers
app.use('/api/category', CategoryRouter);
app.use('/api/SubCategory',SubCategoryRouter );

// 404 Error Handler for Undefined Routes
app.use((req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global Error Handling Middleware
app.use(GlobalError);

// Connect to DB and Start Server
const startServer = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(Uri);
        console.log("Connection to Database successfully established.");
        server = app.listen(Port, () => {
            console.log(`Server running on port ${Port} ...`);
        });
        
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
startServer();