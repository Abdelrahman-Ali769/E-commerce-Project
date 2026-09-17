const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Product title is required."],
            unique: [true, "Product title must be unique."],
            minlength: [3, "Product title must be at least 3 characters."],
            maxlength: [150, "Product title cannot exceed 150 characters."],
        },

        slug: {
            type: String,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            required: [true, "Product description is required."],
            minlength: [20, "Description must be at least 20 characters."],
            maxlength: [5000, "Description cannot exceed 5000 characters."],
        },

        quantity: {
            type: Number,
            default: 0,
            min: [0, "Quantity cannot be negative."],
        },

        sold: {
            type: Number,
            default: 0,
            min: [0, "Sold quantity cannot be negative."],
        },

        price: {
            type: Number,
            required: [true, "Product price is required."],
            min: [0, "Price cannot be negative."],
        },

        priceAfterDiscount: {
            type: Number,
            default: 0,
            min: [0, "Discount price cannot be negative."],
        },

        colors: [
            {
                type: String,
                trim: true,
            },
        ],

        imageCover: {
            type: String,
            required: [true, "Product cover image is required."],
        },

        images: [
            {
                type: String,
            },
        ],

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Product category is required."],
        },

        subCategories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SubCategory",
            },
        ],

        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
        },

        ratingsAverage: {
            type: Number,
            default: 3,
            min: [1, "Rating must be at least 1."],
            max: [5, "Rating cannot exceed 5."],
        },

        ratingsQuantity: {
            type: Number,
            default: 0,
            min: [0, "Ratings quantity cannot be negative."],
        },
    },
    {
        timestamps: true,
    }
);
ProductSchema.pre(/^find/, function () {
    this.populate([
        {
            path: 'category',
            select: 'name'
        }
    ]);
});
const responseOptions = {
    virtuals: true,
    versionKey: false,

    transform: (doc, response) => {

        // Remove MongoDB _id
        delete response._id;

        // Convert imageCover to full URL
        if (response.imageCover) {
            response.imageCover =
                `${process.env.BASE_URL}/uploads/products/${response.imageCover}`;
        }

        // Convert images to full URLs
        if (response.images && response.images.length > 0) {
            response.images = response.images.map(
                (image) =>
                    `${process.env.BASE_URL}/uploads/products/${image}`
            );
        }

        // Format ratings
        response.ratings = {
            average: response.ratingsAverage,
            quantity: response.ratingsQuantity,
        };

        delete response.ratingsAverage;
        delete response.ratingsQuantity;

        return response;
    },
};

ProductSchema.set("toJSON", responseOptions);
ProductSchema.set("toObject", responseOptions);

module.exports = mongoose.model("Product", ProductSchema);