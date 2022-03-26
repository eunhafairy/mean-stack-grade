const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    title: { type: String, required: true },
    user_id: { type: String, required: true },
    faculty_id: { type: String, required: true },
    status: { type: String, default: "Requested" }

});

module.exports = mongoose.model('Request', requestSchema);