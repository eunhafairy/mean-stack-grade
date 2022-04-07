const express = require('express');
const Subject = require('../models/subject');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');



router.post("/create", (req,res, next) =>{

    const subject = new Subject({
      
        subject_name : req.body.subject_name,
        subject_code: req.body.subject_code,
        subject_description: req.body.subject_description
        
    });

    subject.save().then(result => {

        res.status(201).json({
            message: 'Request added successfully',
           subject: {
               ...result,
                subject_id : result._id
            

           }
        });
    });



});



router.get('',checkAuth ,(req,res,next) =>{

 
    const subjQuery = Subject.find();
  
 
    subjQuery
    .then((documents) =>{
    
        res.status(200).json({
            message: 'Request fetched successfully',
            subjects: documents
        });
    });



});




module.exports = router;