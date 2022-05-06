const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();


const requestsRoutes = require('./routes/requests');
const userRoutes = require('./routes/user');
const subjectRoutes = require('./routes/subjects');
const notifRoutes = require('./routes/notif');
//const cors = require('cors');


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
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, *");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS, *");
    next();
    
});



app.use("/files", express.static(path.join("backend/files")));
app.use("/api/requests",requestsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notifs", notifRoutes);

//app.use(cors());
module.exports = app;