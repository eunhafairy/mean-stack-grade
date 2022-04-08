const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const subjectSchema = mongoose.Schema({
    subject_name: { type: String, required: true },
    subject_code: { type: String, required: true, unique: true },
    subject_description: { type: String }
});

subjectSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Subject', subjectSchema);