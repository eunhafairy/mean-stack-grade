const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const { restart } = require('nodemon');
const jwt = require('jsonwebtoken');

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
                error:err
            });
        })
    
    });



})

router.post("/login", (req,res,next) => {

   

    let fetchedUser ;
    //does email exist?
    User.findOne({ email: req.body.email})
    .then(user =>{
       
        if(!user){

            return res.status(401).json({
                message: 'No account found'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
     
    })
    .then(result =>{
   
            if(!result){
                return res
                .status(401)
                .json({
                
                    message: 'Wrong password'
                });
            }
        //create json web token for authentication 
        const token = jwt.sign(
            {email: fetchedUser.email, u_id: fetchedUser._id },
            'secret_this_should_be_longer', { expiresIn: "1h" }
        );
        res.status(200).json({

            token:token

        });

    })
    .catch(err =>{

        console.log(err);
        return res.status(401).json({
        message: 'Error occurred',
        error: err
    });

    })
})


module.exports = router;