const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: String,
    username: String,
    email: String,
    amount: Number,
    ref: String,
    account: String
});

module.exports = mongoose.model('Payment', paymentSchema);