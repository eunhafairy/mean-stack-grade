const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const requestsRoutes = require('./routes/requests');
const userRoutes = require('./routes/user');
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
app.use("/files", express.static(path.join("backend/files")));

app.use((req, res, next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();

});

app.use("/api/requests",requestsRoutes);
app.use("/api/users", userRoutes);

module.exports = app;