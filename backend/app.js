const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Request = require('./models/request');

const app = express();


mongoose.connect("mongodb+srv://nekko:siVlysx3r6WK4GNw@cluster0.uxoq8.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() =>{
console.log('Connected to database');
})
.catch(() =>{
    console.log('Failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();

});

app.post("/api/requests", (req,res,next) =>{
    
    const request = new Request({
        title:  req.body.title,
        user_id:  req.body.user_id,
        faculty_id:  req.body.faculty_id,
        status:  req.body.status

    });

    request.save();
    res.status(201).json({
        message: 'Request added successfully'
    });
    
});


app.get('/api/requests' ,(req,res,next) =>{

    Request.find()
    .then((documents) =>{
        console.log(documents);
        res.status(200).json({
            message: 'Request fetched successfully',
            requests: documents
        });
    });




});

app.delete("/api/requests/:id", (req,res,next) => {

    Request.deleteOne({_id: req.params.id})
    .then((result)=>{
        console.log(result);
        res.status(200).json({
            message: "Request deleted!"
        });

    });
    
});



module.exports = app;