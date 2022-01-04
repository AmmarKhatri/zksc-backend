const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    divbon: String,
    scrip: String,
    buydate: String,
    qty: Number,
    buyrate: Number,
    buyamount: Number,
    soldpending: String,
    saledate: String,
    salerate: Number,
    saleamount: Number,
    commrate: Number,
    cgtrate: Number,
    pls: Number,
    netprofit: Number,
    commamount: Number,
    status: String,
});

module.exports = mongoose.model('Trade', tradeSchema);