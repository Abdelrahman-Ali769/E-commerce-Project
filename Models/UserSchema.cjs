const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Name is required'],
        },

        slug: {
            type: String,
            lowercase: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            unique: true,
            trim: true,
        },

        phone: {
            type: String,
        },

        ProfileImage: {
            type: String,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password is too short'],
        },

        passwordChangedAt: Date ,

        role: {
            type: String,
            enum: ['user', 'admin','manager'],
            default: 'user',
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);
UserSchema.pre('save', async function () {
    const user = this
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10)
        this.passwordChangedAt =new Date()
    }
    // next()
})
UserSchema.virtual("imageUrl").get(function () {
    if (!this.ProfileImage) return null;

    return `${process.env.BASE_URL}/uploads/Users/${this.ProfileImage}`;
});

const responseOptions = {
    virtuals: true,
    versionKey: false,

    transform: (doc, response) => {
        delete response._id;
        return response;
    },
};

UserSchema.set("toJSON", responseOptions);
UserSchema.set("toObject", responseOptions);

module.exports = mongoose.model('User', UserSchema);