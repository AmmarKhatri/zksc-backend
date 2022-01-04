const mongoose = require('mongoose');

const logsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    timestamp: String,
    email: String,
    password: String,
});

module.exports = mongoose.model('Log', logsSchema);