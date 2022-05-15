const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    f_name: { type: String, required: true },
    l_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    e_sig: {type: String},
    role: {type:String, required: true},
    student_no: {type:String, required: false, default: null},
    course: {type: String, enum: ['BSIT', 'BLIS'], required: false},
    year: {type: Number, enum: [1,2,3,4], required: false},
    section : {type: String, enum : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H','I','J','K','L','M', 'N','O','P', 'Q', 'R', 'S', 'T','U', 'V', 'W','X','Y','Z'], required: false},
    password: {type: String, required: true, min:[6, 'Password too short']},
    status: {type: String, enum: ['Pending', 'Rejected', 'Accepted', 'Archive'], required: false, default:"Pending"},
    rejectedReason  : {type: String, required: false, default: null}
   
    
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);