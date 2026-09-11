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
    image: {
        type: String
    }
}, { timestamps: true })

CategorySchema.virtual("imageUrl").get(function () {
    if (!this.image) return null;

    return `${process.env.BASE_URL}/uploads/categories/${this.image}`;
});

const responseOptions = {
    virtuals: true,
    versionKey: false,

    transform: (doc, response) => {
        delete response._id;
        return response;
    },
};

CategorySchema.set("toJSON", responseOptions);
CategorySchema.set("toObject", responseOptions);

module.exports = mongoose.model("Category", CategorySchema);



