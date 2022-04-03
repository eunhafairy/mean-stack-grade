const express = require('express');
const Request = require('../models/request');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "backend/files");
    },
    filename: (req, file, cb) =>{
       console.log('file name is: ' +file.originalname);
        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + getFileExt(file.originalname));
    }

});

router.post("", checkAuth, multer({storage: storage}).single('file'), (req,res,next) =>{
    const url = req.protocol + '://'+req.get('host');
    const request = new Request({
        title:  req.body.title,
        user_id:  req.body.user_id,
        faculty_id:  req.body.faculty_id,
        status:  req.body.status,
        filePath: url+'/files/'+req.file.filename,
        creator : req.userData.u_id
        
    });

    console.log(req.userData.u_id);
       
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



router.put("/:id", checkAuth,multer({storage: storage}).single('file'), (req,res, next) =>{

    
    let filePath = req.body.filePath;
    if(req.file){
        const  url = req.protocol + "://"+req.get("host");
        filePath = url+"/files/"+req.file.filename;

    }

    const request = new Request({

        _id: req.body.request_id,
        title: req.body.title,
        user_id: req.body.user_id,
        faculty_id: req.body.faculty_id,
        status: req.body.status,
        filePath :filePath

    });
    console.log();
    Request.updateOne({_id: req.params.id}, request )
    .then(result =>{
        res.status(200).json({message:'update successful'});
    })

})

//======================GET FILE EXT=============================
function getFileExt(fileName){
    return fileName.split('.').pop();
}

module.exports = router;