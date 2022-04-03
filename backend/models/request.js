const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    title: { type: String, required: true },
    user_id: { type: String, required: true },
    faculty_id: { type: String, required: true },
    status: { type: String, default: "Requested" },
    filePath: {type: String, default: ''},
   creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" ,required: true }

});

module.exports = mongoose.model('Request', requestSchema);