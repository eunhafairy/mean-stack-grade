const express = require('express');
const Request = require('../models/request');
const router = express.Router();



router.post("", (req,res,next) =>{
    
    const request = new Request({
        title:  req.body.title,
        user_id:  req.body.user_id,
        faculty_id:  req.body.faculty_id,
        status:  req.body.status

    });

    request.save().then(result => {
        res.status(201).json({
            message: 'Request added successfully',
            requestId: result._id
        });
    });
  
    
});


router.get('' ,(req,res,next) =>{

    Request.find()
    .then((documents) =>{
        console.log(documents);
        res.status(200).json({
            message: 'Request fetched successfully',
            requests: documents
        });
    });




});

router.get("/:id", (req, res, next) =>{

    Request.findById(req.params.id).then( post =>{
        if(post){
            res.status(200).json(post);
        }
        else{

            res.status(404).json({

                message: "not found"

            });
        }

    });
})

router.delete("/:id", (req,res,next) => {

    Request.deleteOne({_id: req.params.id})
    .then((result)=>{
        console.log(result);
        res.status(200).json({
            message: "Request deleted!"
        });

    });
    
});

router.put("/:id", (req,res, next) =>{
    const request = new Request({

        _id: req.body.request_id,
        title: req.body.title,
        user_id: req.body.user_id,
        faculty_id: req.body.faculty_id,
        status: req.body.status

    });
    Request.updateOne({_id: req.params.id}, request ).then(result =>{

        console.log(result);
        res.status(200).json({message:'update successful'});
    })

})

module.exports = router;