const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SubCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name Required"],
            unique: [true, "name Must Be Unique"],
            minlength: [2, "it's Too Short"],
            maxlength: [32, "it's Too Long"],
            trim: true
        },

        slug: {
            type: String,
            lowercase: true
        },

        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "SubCategory must belong to parent category"]
        }
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.SubCategory ||
    mongoose.model("SubCategory", SubCategorySchema);