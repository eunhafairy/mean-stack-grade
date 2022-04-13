const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "backend/files");

    },
    filename: (req,file,cb) => {

        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + getFileExt(file.originalname));

    }

});


router.post("/signup", multer({storage: storage}).single('e_sig'), (req,res, next) =>{

    const url = req.protocol + '://'+ req.get('host');

    bcrypt.hash(req.body.password, 10)
    .then(hash =>{

        let user;
        if(req.body.role === 'Faculty' || req.body.role === 'Admin'){

            console.log('no student no');
            user = new User({

                f_name: req.body.f_name,
                l_name: req.body.l_name,
                email:req.body.email,
                password: hash,
                role: req.body.role,
                e_sig: url+ '/files/' + req.file.filename
    
            });


        }

        else{
            console.log('yes student no');
            user = new User({

                f_name: req.body.f_name,
                l_name: req.body.l_name,
                email:req.body.email,
                password: hash,
                role: req.body.role,
                student_no : req.body.student_no,
                e_sig: url+ '/files/' + req.file.filename
    
            });

        }
     
        console.log(user);

        user.save()
        .then(result => {

            res.status(201).json({
                message: 'User created',
                result: result
            });

        })
        .catch(err => {
            console.log("error is : " + err);
            res.status(500).json({
                error:err,
                message: "Error occurred."
            });
        })
    
    });



});

router.delete("/:id",checkAuth, (req,res,next) => {

    User.deleteOne({_id: req.params.id})
    .then((result)=>{
        console.log(result);
        res.status(200).json({
            message: "User deleted!"
        });

    })
    .catch(err =>{
       
        res.status(500).json({
            error:err,
            message:"Error occurred."
        });

    });
    
});

router.post("/login", (req,res,next) => {


    let fetchedUser ;
    let haveAccount;
    //does email exist?
    User.findOne({ email: req.body.email})
    .then(user =>{
       
        if(!user){
            console.log("NO ACCOUNT");
            haveAccount = false;
            return res.status(401).json({message: 'No account found'});
        }
        else{
            console.log("FETCHING USER");
            haveAccount = true;
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);

        }
        
     
    })
    .then(result =>{
   
            if(!result){
                console.log("WRONG PASSWORD!");
                return res
                .status(401)
                .json({       
                    message: 'Wrong password'
                });
            }
        //create json web token for authentication 
      
        if(haveAccount){

            console.log("ADDING TOKEN!");
            const token = jwt.sign(
                {email: fetchedUser.email, u_id: fetchedUser._id, role: fetchedUser.role},
                'secret_this_should_be_longer', { expiresIn: "1h" }
            );
    
    
            res.status(200).json({
    
                token:token,
                expiresIn: 3600,
                u_id: fetchedUser._id,
                role: fetchedUser.role
    
            });
        

        }

    })
    .catch(err =>{

        console.log(err);

        return res.status(401).json({
        message: 'Error occurred',
        error: err
    });

    })
})




router.put("/:id", checkAuth, multer({storage: storage}).single('e_sig'), (req,res, next) =>{


    let e_sig = req.body.e_sig;
    if(req.file){
        const  url = req.protocol + "://"+req.get("host");
        e_sig = url+"/files/"+req.file.filename;

    }



    const user = new User({

    _id: req.body.u_id,
    f_name: req.body.f_name,
    l_name: req.body.l_name,
    role: req.body.role,
    email: req.body.email,
    student_no: req.body.student_no,
    e_sig: e_sig


    });
     
    User.updateOne({_id: req.params.id}, user )
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


router.get('/:role', checkAuth, (req, res, next) =>{

   
   User.find({role: req.params.role})
   .then(documents =>{

    res.status(200).json({

        message: "Success!",
        users: documents

    });

   })
   .catch(err=>{

    res.status(500).json({

        message:"error occured",
        error:err

    });

   });





});

router.get('/find/:id', checkAuth ,(req, res, next) =>{

    console.log('went here');
    User.findById(req.params.id)
    .then( user =>{
        if(user){

            console.log("database"+user);
            res.status(200).json(user);
        }
        else{

            res.status(404).json({

                message: "not found"

            });
        }

    });
 
 
 });



router.get('',checkAuth ,(req,res,next) =>{

  
    const userQuery = User.find();

   
    userQuery
    .then((documents) =>{
    

        console.log('success');
        res.status(200).json({
            message: "Success!",
            users: documents

        });
    })
    .catch(err=>{

        console.log('err' + err);
        res.status(500).json({


            error:err,
            message: "something went wrong "

        });

    });
    





});


function getFileExt(fileName){
    return fileName.split('.').pop();
}

// router.get('/findnames',checkAuth ,(req,res,next) =>{

//     const u_id = +req.query.user_id;
//     const f_id = +req.query.faculty_id;
//     const postQuery = Request.find();
//     let fetchedRequests;

//     if(pageSize && currentPage){
//         postQuery
//         .skip(pageSize * (currentPage - 1))
//         .limit(pageSize);
//     }

//     postQuery
//     .then((documents) =>{
//         fetchedRequests = documents;
//       return Request.count();  
//     })
//     .then(count => {
//         res.status(200).json({
//             message: 'Request fetched successfully',
//             requests: fetchedRequests,
//             maxRequests: count
//         });
//     });




// });

module.exports = router;