const express = require('express');
const Subject = require('../models/subject');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');



router.delete("/:id",checkAuth, (req,res,next) => {

    Subject.deleteOne({_id: req.params.id})
    .then((result)=>{
        console.log(result);
        res.status(200).json({
            message: "Subject deleted!"
        });

    })
    .catch(err =>{
    
        res.status(500).json({
            error:err,
            message:"Subject deletion failed. Error occurred."
        });

    });
    
});




router.put("/:id", checkAuth, (req,res, next) =>{

    

    const subj = new Subject({

        _id: req.body.subject_id,
        subject_code: req.body.subject_code,
        subject_name: req.body.subject_name,
        subject_description: req.body.subject_description
    

    });
 

    Subject.updateOne({_id: req.params.id}, subj )
    .then(result =>{
        res.status(200).json({
            message:'Subject update successful!',
            result: result
        });
    })
    .catch(err =>{

        res.status(500).json({

            message: 'Something went wrong',
            error: err

        });

    })

})


router.post("/create", (req,res, next) =>{

    const subject = new Subject({
      
        subject_name : req.body.subject_name,
        subject_code: req.body.subject_code,
        subject_description: req.body.subject_description
        
    });

    subject.save()
    .then(result => {

        res.status(201).json({
            message: 'Subject added successfully',
           subject: {
               ...result,
                subject_id : result._id
            

           }
        });
    })
    .catch(err =>{

        res.status(500).json({

            error: err,
            message: "Subject creation error occurred!"

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
    })
    .catch(err=>{

        res.status(500).json({

            message: 'error occured',
            error: err

        });
    });



});




module.exports = router;