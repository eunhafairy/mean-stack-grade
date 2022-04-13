const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    f_name: { type: String, required: true },
    l_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    e_sig: {type: String, required: true},
    role: {type:String, required: true},
    student_no: {type:String, required: false, default: null},
    course: {type: String, enum: ['BSIT', 'BLIS'], required: false},
    year: {type: Number, enum: [1,2,3,4], required: false},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);