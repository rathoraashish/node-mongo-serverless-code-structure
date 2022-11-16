import mongoose from 'mongoose';
// var uniqueValidator = require("mongoose-unique-validator");

const { Schema, Types } = mongoose;

const userSchema = new Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, unique: true },
        password: { type: String, required: true },
        phone_no: { type: String }
    },  
    { timestamps: true }
);

const User = mongoose.model("users", userSchema);

export { User }
