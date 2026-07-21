require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")
const CategoryRouter =require('./Routers/CategoryRouter.cjs')
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
app.use('/',CategoryRouter)
// error Listen 
app.use((req, res) => {
    res.status(404).send({
        return: req.originalUrl + "Not Found"
    })
})
// listening to Server 
app.listen(Port, () => {
    console.log(`Server Runing at ${Port} ....`)
})
