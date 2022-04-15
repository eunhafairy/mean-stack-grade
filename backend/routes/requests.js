const express = require('express');
const Request = require('../models/request');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');


router.post("", checkAuth, (req,res,next) =>{
   
  
    console.log(req.body.subject);
    const request = new Request({
        subject:  req.body.subject,
        user_id:  req.body.user_id,
        faculty_id:  req.body.faculty_id,
        status:  req.body.status,
        creator : req.userData.u_id,
        desc: req.body.desc
        
    });

    request.save().then(result => {
        res.status(201).json({
            message: 'Request added successfully',
           request: {
               ...result,
                request_id : result._id
            

           }
        });
    })
    .catch(err=>{

        res.status(500).json({

            message: "Something went wrong",
            error: err

        });
    });
  
    
});


router.get('',checkAuth ,(req,res,next) =>{


    Request.find()
    .then((documents) =>{

        res.status(200).json({
            message: 'Request fetched successfully',
            requests: documents
        }); 
    })
   


});



router.get('/:status',checkAuth ,(req,res,next) =>{

    Request.find({status: req.params.status})
    .then( post =>{
       
            res.status(200).json( {

                message:"Success!",
                requests: post

      }); 
     })
    .catch(err=>{

        res.status(500).json({

            message: "An error occured",
            error: err

        });

    });



});



router.get("/:id",checkAuth, (req, res, next) =>{

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

router.delete("/:id",checkAuth, (req,res,next) => {

    Request.deleteOne({_id: req.params.id})
    .then((result)=>{
        console.log(result);
        res.status(200).json({
            message: "Request deleted!"
        });

    })
    .catch(err=>{

        res.status(500).json({

            message: 'An error occurred while deleting. check logs',
            error:err

        });

    });
    
});



router.put("/:id", (req,res, next) =>{

   

    const request = new Request({

        _id: req.body.request_id,
        subject: req.body.subject,
        user_id: req.body.user_id,
        faculty_id: req.body.faculty_id,
        status: req.body.status,
        creator: req.body.creator,
        desc: req.body.desc

    });
 
    Request.updateOne({_id: req.params.id}, request )
    .then(result =>{
        res.status(200).json({message:'update successful'});
    })
    .catch(err=>{

        res.status(500).json({

            error: err,
            message: "Something went wrong!"
        })

    })

})




router.put("update-status/:id", (req,res, next) =>{

   

    const request = new Request({

        _id: req.body.request_id,
        subject: req.body.subject,
        user_id: req.body.user_id,
        faculty_id: req.body.faculty_id,
        status: req.body.status,
        creator: req.body.creator,
        desc: req.body.desc

    });
 
    Request.updateOne({_id: req.params.id}, request )
    .then(result =>{
        res.status(200).json({message:'update successful'});
    })
    .catch(err=>{

        res.status(500).json({

            error: err,
            message: "Something went wrong!"
        })

    })

})


module.exports = router;