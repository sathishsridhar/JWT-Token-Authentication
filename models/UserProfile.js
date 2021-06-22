const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserProfile = new Schema({
    username : String,
    password : String,
    created_at:String
});

module.exports = mongoose.model("UserProfile",UserProfile);
