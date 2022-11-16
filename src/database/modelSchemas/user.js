import mongoose from 'mongoose';
// var uniqueValidator = require("mongoose-unique-validator");

const { Schema, Types } = mongoose;

const userSchema = new Schema(
    {
        name: String,
        age: Number,
        technology: String,
    },
    { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export { User }
