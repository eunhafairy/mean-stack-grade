const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    subject: { type: String, required: true },
    user_id: {type:  mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    faculty_id: { type:  mongoose.Schema.Types.ObjectId,  ref: "User", required: true },
    status: { type: String, default: "Requested" },
    desc: { type: String, default: null, required: false },
    cys: { type: String,  required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" ,required: true },
    dateRequested : {type:Date, required: true},
    dateAccepted: {type: Date, required: false, default:null},
    semester: {type:String, required: true },
    year: {type:Number, required:true},
    verdict: {type:String, enum:['1.00','1.25','1.50','1.75','2.00', '2.25','2.50','2.75','3.00'], required:false},
    request_form : {type: String, required: true},
    note : {type:String, required: false, default:null}
});

module.exports = mongoose.model('Request', requestSchema);