const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BrandSchema = new Schema({
    name: {
        type: String,
        required: [true, "name Required "],
        unique: [true, "name unique "],
        minlength: [5, "too Short "],
        maxlength: [15, "too long "],
    },
    slug: {
        type: String,
        lowercase: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Brand', BrandSchema)


