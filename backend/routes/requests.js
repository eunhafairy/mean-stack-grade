const express = require('express');
const Request = require('../models/request');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const { json } = require('body-parser');
const multer = require('multer');
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "backend/files");

    },
    filename: (req,file,cb) => {

        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + getFileExt(file.originalname));

    }

});


router.post("", multer({storage: storage}).single('request_form'), checkAuth, (req,res,next) =>{

    let request_form = req.body.request_form;
    if(req.file){
        const  url = req.protocol + "://"+req.get("host");
        request_form = url+"/files/"+req.file.filename;

    }
   
    const request = new Request({
        subject:  req.body.subject,
        user_id:  req.body.user_id,
        faculty_id:  req.body.faculty_id,
        status:  req.body.status,
        creator : req.userData.u_id,
        desc: req.body.desc,
        dateRequested: req.body.dateRequested,
        semester: req.body.semester,
        year: req.body.year,
        cys: req.body.cys,
        request_form:  request_form
        
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



router.get("/find/:id",checkAuth, (req, res, next) =>{

    Request.findById(req.params.id).then( post =>{
        if(post){
            res.status(200).json(post);
        }
        else{

            res.status(404).json({

                message: "not found"

            });
        }

    })
    .catch(err=>{

        res.status(500).json({

            message:"An error occured",
            error: err

        })

    });
})

router.delete("/:id",checkAuth, (req,res,next) => {

    Request.deleteOne({_id: req.params.id})
    .then((result)=>{
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

   let request_form = req.body.request_form;
    if(req.file){
        
        const  url = req.protocol + "://"+req.get("host");
        request_form = url+"/files/"+req.file.filename;

    }
   

    const request = new Request({

        _id: req.body.request_id,
        subject: req.body.subject,
        user_id: req.body.user_id,
        faculty_id: req.body.faculty_id,
        status: req.body.status,
        creator: req.body.creator,
        desc: req.body.desc,
        semester: req.body.semester,
        year: req.body.year,
        note: req.body.note,
        cys: req.body.cys,
        request_form: request_form

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



function getFileExt(fileName){
    return fileName.split('.').pop();
}

module.exports = router;