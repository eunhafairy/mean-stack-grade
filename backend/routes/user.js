const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');


router.post("/signup", (req,res, next) =>{

    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        const user = new User({

            f_name: req.body.f_name,
            l_name: req.body.l_name,
            email:req.body.email,
            password: hash,
            role: req.body.role
    

        });
        user.save()
        .then(result => {

            res.status(201).json({
                message: 'User created',
                result: result
            });

        })
        .catch(err => {
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




router.put("/:id", checkAuth, (req,res, next) =>{

    

    const user = new User({

        _id: req.body.u_id,
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        role: req.body.role,
        email: req.body.email,
    

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


router.get('',checkAuth ,(req,res,next) =>{

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = User.find();
    let fetchedRequests;

    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    postQuery
    .then((documents) =>{
      fetchedRequests = documents;
      return User.count();  
    })
    .then(count => {
       
        res.status(200).json({
            message: 'Request fetched successfully',
            users: fetchedRequests,
            maxUsers: count
        });
    });




});


module.exports = router;