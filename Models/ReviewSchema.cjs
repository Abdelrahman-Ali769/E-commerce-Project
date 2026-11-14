
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Review Title Required"]
    },

    rating: {
        type: Number,
        min: [1, "The min rate is 1.0"],
        max: [5, "The max rate is 5.0"]
    },

    review: {
        type: String,
        required: [true, "Review content is required"],
        trim: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The Review Must belong to User"]
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "The Review Must belong to Product"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Review", ReviewSchema);
