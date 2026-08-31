process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...");
    console.error(err);
    process.exit(1);
});


require("dotenv").config();
const express = require("express");
const ApiError = require("./utils/ApiError.cjs");
const GlobalError = require("./middlewares/ErrorMiddleware.cjs");
const CategoryRouter = require("./Routers/CategoryRouter.cjs");
const SubCategoryRouter = require("./Routers/SubCategoryRouter.cjs");
const BrandRouter = require("./Routers/BrandRouter.cjs");
const ProductRouter = require("./Routers/ProductRouter.cjs");
const connectDB = require("./.config/DataBaseConnection.cjs");

const app = express();
const Port = process.env.PORT || 3000;

let server;


// Middlewares

app.set("query parser", "extended");
app.use(express.json());


// Routes

app.use("/api/category", CategoryRouter);
app.use("/api/subcategory", SubCategoryRouter);
app.use("/api/product", ProductRouter);
app.use("/api/brand", BrandRouter);


// 404 Error

app.use((req, res, next) => {
    next(
        new ApiError(
            `Can't find this route: ${req.originalUrl}`,
            404
        )
    );
});


// Global Error Handler

app.use(GlobalError);


// Unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
    console.error(
        `UNHANDLED REJECTION! ${err.name}: ${err.message}`
    );

    if (server) {
        server.close(() => {
            console.error("Server shutting down...");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// Connect DB + Start Server

const startServer = async () => {
    await connectDB();

    server = app.listen(Port, () => {
        console.log(`Server running on port ${Port}...`);
    });
};

startServer();