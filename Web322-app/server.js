/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Elliot Maude Student ID: 032830127 Date: 2/21/18
*
* Online (Heroku) Link: https://intense-falls-96148.herokuapp.com/
*
********************************************************************************/

//node & npm
const http = require('http');
const express = require('express');
const url = require('url');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');

//custom
const data = require('./data-service.js');

//global variables
const app = express();
const port = process.env.PORT || 8080;

//midware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

//routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get('/employees', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json({ err: err });
        });
    }
    else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json({ err: err });
        });
    }
    else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager).then(function(data) {
            res.json(data);
        }).catch(function (err) {
            res.json({ err: err });
        });
    }
    else {
        data.getAllEmployees().then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.json({ err: err });
        });
    }
});

app.get('/departments', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    data.getDepartments().then((data) => {
        res.json(data);
    }
    ).catch((err) => {
        res.json({ error: err });
        console.log(err);
    });
});

app.get('/managers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    data.getManagers().then((data) => {
        res.json(data);
    }
    ).catch((err) => {
        res.json({ error: err });
        console.log(err);
    });
});

app.get('/employees/add', function (req, res) {
    res.sendFile(path.join(__dirname, "views/addEmployee.html"));
});

app.get('/images/add', function (req, res) {
    res.sendFile(path.join(__dirname, "views/addImage.html"));
});

app.post('/images/add', upload.single("imageFile"), function (req, res) {
    res.redirect("/images");
});

app.get('/images', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.json(items);
    });
});

app.post('/employees/add', function (req, res) {
    data.addEmployee(req.body).then(() => {
        res.redirect('/employees');
    }).catch((err) => { throw err; });
});

app.get('/employees/:num', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    data.getEmployeesByNum(req.params.num).then(function (data) {
        res.json(data);
    }).catch(function (err) {
        res.json({ err: err });
    });
});

//init 
data.initalize().then(
    (result) => {
        app.listen(port, () => {
            console.log("Express http server listening on " + port);
        });
    }
).catch((err) => {
    console.log(err);
});