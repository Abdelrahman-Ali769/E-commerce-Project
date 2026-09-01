const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CategorySchema = new Schema({
    name: {
        type: String,
        required: [true, "name Required "],
        unique: [true, "name unique "],
        minlength: [3, "too Short "],
        maxlength: [32, "too long "],
    },
    slug: {
        type: String,
        lowercase: true
    },
    image : {
        type:String
    }
}, { timestamps: true })

module.exports = mongoose.model('Category', CategorySchema)


