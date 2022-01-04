const mongoose = require('mongoose');

const memberSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    password: String,
    number: String,
    country: String,
    balance: Number,
    active: String,
    commrate: Number,
});

module.exports = mongoose.model('Member', memberSchema);