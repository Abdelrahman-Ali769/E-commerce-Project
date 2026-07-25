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
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(Uri)
        console.log("Connection To Data base successfuly")
    }
    catch (error) {
        console.log(error)
        process.exit(1)
    }
}

ConnectToDB()
app.use('/', CategoryRouter)
// error Listen 


app.use((req,res,next)=>{
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404))
})

// Global Error Handling Middleware
app.use(GlobalError);

// listening to Server 
app.listen(Port, () => {
    console.log(`Server Runing at ${Port} ....`)
})
