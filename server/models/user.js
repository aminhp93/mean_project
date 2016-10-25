var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: { type: String },
    image_url: { type: String },
    age_range: { type: String },
    email: { type: String },
    gender: { type: String }
}, { timestamps: true });

mongoose.model('User', UserSchema);
