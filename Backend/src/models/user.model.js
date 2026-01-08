const mongoose = require("mongoose");

// creates the schema
const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    }
}, {
    timestamps: true
});

// creates the model
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;