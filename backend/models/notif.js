const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const notifSchema = mongoose.Schema({
    user_id: { type:  mongoose.Schema.Types.ObjectId,  ref: "User", required: true},
    type: { type: String, enum: ['Create', 'Processing', 'Reject', 'Completed'], required: true },
    desc: { type: String },
    faculty_id: {type:  mongoose.Schema.Types.ObjectId,  ref: "User", required: true},
    subject: {type: String,  required: true },
    dateCreated : {type:Date, required: true, default: Date.now()},
    isRead: {type: Boolean, required: true, default: false}
});

notifSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Notif', notifSchema);