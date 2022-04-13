const express = require('express');
const Request = require('../models/request');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');


router.post("", checkAuth, (req,res,next) =>{
   
  
    const request = new Request({
        title:  req.body.title,
        user_id:  req.body.user_id,
        faculty_id:  req.body.faculty_id,
        status:  req.body.status,
        creator : req.userData.u_id
        
    });

    request.save().then(result => {
        res.status(201).json({
            message: 'Request added successfully',
           request: {
               ...result,
                request_id : result._id
            

           }
        });
    });
  
    
});


router.get('',checkAuth ,(req,res,next) =>{

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Request.find();
    let fetchedRequests;

    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    postQuery
    .then((documents) =>{
        fetchedRequests = documents;
      return Request.count();  
    })
    .then(count => {
        res.status(200).json({
            message: 'Request fetched successfully',
            requests: fetchedRequests,
            maxRequests: count
        });
    });




});



router.get('/:status',checkAuth ,(req,res,next) =>{

    Request.find(req.params.id).then( post =>{
        if(post){
            res.status(200).json(post);
        }
        else{

            res.status(404).json({

                message: "not found"

            });
        }

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