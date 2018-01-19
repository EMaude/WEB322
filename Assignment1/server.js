/*********************************************************************************
* WEB322: Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Elliot Maude      Student ID: 032830127    Date: 1/19/2018
*
* Online (Heroku) URL: https://morning-hollows-99559.herokuapp.com/
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

app.get("/", (req, res)=> {
    res.send("Elliot Maude - 032830127");
});

app.listen(HTTP_PORT);