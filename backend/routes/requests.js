const express = require('express');
const Request = require('../models/request');
const router = express.Router();
const multer = require('multer');
const { forEachLeadingCommentRange } = require('typescript');


const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "backend/files");
    },
    filename: (req, file, cb) =>{
       console.log('file name is: ' +file.originalname);
        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + getFileExt(file.originalname));
    }

});

router.post("", multer({storage: storage}).single('file'), (req,res,next) =>{
    const url = req.protocol + '://'+req.get('host');
    const request = new Request({
        title:  req.body.title,
        user_id:  req.body.user_id,
        faculty_id:  req.body.faculty_id,
        status:  req.body.status,
        filePath: url+'/files/'+req.file.filename
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
        filePath :req.body.filePath

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