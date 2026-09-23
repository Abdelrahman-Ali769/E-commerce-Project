const mongoose  = require('mongoose')
const UserSchema = new mongoose.Schema({
    name : {
        type  :String,
        trim : true ,
        required :[true,"Name is Required"] 
    } ,
    slug : {
        type :String ,
        lowercase: true
    } ,
    email : {
        type :String ,
        required : [true ,"Email requred"] ,
        lowercase :true ,
        unique : true
    },
    phone  :String ,
    ProfileImage :String,
    password : {
        type :String ,
        required :[true , "Required"] ,
        minlength   :[6,"Too short"] 
    },
    role :{
        type: String ,
        enum :['user','admin'],
        default : 'user'
    }
},{timestamps :true})
module.exports =mongoose.model('UserSchema',UserSchema)