const express = require('express');
const Notif = require('../models/notif');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');



// router.delete("/:id",checkAuth, (req,res,next) => {

//     Subject.deleteOne({_id: req.params.id})
//     .then((result)=>{
//         console.log(result);
//         res.status(200).json({
//             message: "Subject deleted!"
//         });

//     })
//     .catch(err =>{
    
//         res.status(500).json({
//             error:err,
//             message:"Subject deletion failed. Error occurred."
//         });

//     });
    
// });




// router.put("/:id", checkAuth, (req,res, next) =>{

    

//     const subj = new Subject({

//         _id: req.params.id,
//         subject_code: req.body.subject_code,
//         subject_name: req.body.subject_name,
//         subject_description: req.body.subject_description
    

//     });
 

//     Subject.updateOne({_id: req.params.id}, subj )
//     .then(result =>{
//         res.status(200).json({
//             message:'Subject update successful!',
//             result: result
//         });
//     })
//     .catch(err =>{

//         res.status(500).json({

//             message: 'Something went wrong',
//             error: err

//         });

//     })

// })


router.get('/checkread/:id', checkAuth ,(req,res,next) =>{

  

    Notif.find().where('user_id').equals(req.params.id)
    .where('isRead').equals(false)
    .then( post =>{
       
            res.status(200).json( {

                message:"Success!",
                notifs: post

      }); 
     })
    .catch(err=>{

        res.status(500).json({

            message: "An error occured",
            error: err

        });

    });



});


router.put("/changeread/:id", checkAuth, (req, res, next)=>{
    
    
    

    Notif.updateOne({_id: req.params.id}, {

        isRead: true

    })
    .then(result =>{
        res.status(200).json({
            message:'update successful',
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


router.delete("/:id",checkAuth, (req,res,next) => {

    Notif.deleteOne({_id: req.params.id})
    .then((result)=>{
        res.status(200).json({
            message: "Notif deleted!"
        });

    })
    .catch(err=>{

        res.status(500).json({

            message: 'An error occurred while deleting. check logs',
            error:err

        });

    });
    
});


router.get('/checkreadfaculty/:id', checkAuth ,(req,res,next) =>{

  
    console.log('checking read');

    Notif.find().where('faculty_id').equals(req.params.id)
    .where('isRead').equals(false)
    .then( post =>{
       
            res.status(200).json( {

                message:"Success!",
                notifs: post

      }); 
     })
    .catch(err=>{

        res.status(500).json({

            message: "An error occured",
            error: err

        });

    });



});


router.post("", (req,res, next) =>{

    const notif = new Notif({
      
        type: req.body.type,
        user_id : req.body.user_id,
        faculty_id: req.body.faculty_id,
        subject: req.body.subject
        
    });

    notif.save()
    .then(result => {

        res.status(201).json({
            message: 'Notif added successfully',
            notif: result
        });
    })
    .catch(err =>{

        res.status(500).json({

            error: err,
            message: "Notif creation error occurred!"

        });

    });



});



router.get('',checkAuth ,(req,res,next) =>{

 
    const notifQuery = Notif.find();
  
 
    notifQuery
    .then((documents) =>{
    
        res.status(200).json({
            message: 'Request fetched successfully',
            notifs: documents
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