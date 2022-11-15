// const config = require('../config');
import config from '../config.js';
import mongoose from 'mongoose';
import User from './user.js'
const db = {}

db.mongoose = mongoose;
db.url = config.mongoUrl;
db.mongoose.connect(db.url,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    console.log("Connected DB")
}).catch((error) => {
    console.log("Can't Connected DB", error);
    process.exit();
})

db.Client = User(mongoose);

export default db;