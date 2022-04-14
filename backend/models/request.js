const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    subject: { type: String, required: true },
    user_id: {type:  mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    faculty_id: { type:  mongoose.Schema.Types.ObjectId,  ref: "User", required: true },
    status: { type: String, default: "Requested" },
    desc: { type: String, default: null, required: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" ,required: true }

});

module.exports = mongoose.model('Request', requestSchema);