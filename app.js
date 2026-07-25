process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION ");
    console.error(err.name);
    console.error(err.message);
    process.exit(1);
});

require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")
const CategoryRouter = require('./Routers/CategoryRouter.cjs')
const ApiError = require('./utils/ApiError.cjs')
const GlobalError = require('./middlewares/ErrorMiddleware.cjs')
const app = express()
app.use(express.json())

// Connection to Data Base 

const Uri = process.env.MONGO_URI
const Port = process.env.PORT

const ConnectToDB = async () => {
    mongoose.set('strictQuery', false)
    await mongoose.connect(Uri)
    console.log("Connection To Data base successfuly")
}

ConnectToDB()
app.use('/', CategoryRouter)

// error Listen  for express 

app.use((req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404))
})

// Global Error Handling Middleware
app.use(GlobalError);

// listening to Server 

const Server = app.listen(Port, () => {
    console.log(`Server Runing at ${Port} ....`)
})

// unhandledRejection Errors 

process.on("unhandledRejection", (err) => {
    console.error(`unhandledRejection : ${err}`)
    Server.close(() => {
        console.error("Server Shutting Down ...")
        process.exit(1)
    })
})
