// const config = require('../config');
import config from '../config.js';
import mongoose from 'mongoose';

const db = {}

mongoose.set("debug", true);

db.mongoose = mongoose;
db.url = config.mongoUrl;
db.mongoose.connect(db.url,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).then(() => {
    console.log("Connected DB")
}).catch((error) => {
    console.log("Can't Connected DB", error);
    process.exit();
})
