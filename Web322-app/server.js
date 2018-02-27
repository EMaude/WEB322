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
const exphbs = require("express-handlebars");

//custom
const data = require('./data-service.js');

//global variables
const app = express();
const port = process.env.PORT || 8080;

//template engine
app.engine('.hbs', exphbs({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
            '><a href="' + url + '">' + options.fn(this) + '</a></li>';
           },
           equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }  
    }
}));
app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });
   

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
    res.redirect('/home');
});

app.get('/home', function (req, res) {
    res.render('home', {});
});

app.get('/about', function (req, res) {
    res.render('about', {});
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

/*app.get('/managers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    data.getManagers().then((data) => {
        res.json(data);
    }
    ).catch((err) => {
        res.json({ error: err });
        console.log(err);
    });
});*/

app.get('/employees/add', function (req, res) {
    res.render('addEmployee', {});
});

app.get('/images/add', function (req, res) {
    res.render('addImage', {});
});

app.post('/images/add', upload.single("imageFile"), function (req, res) {
    res.redirect("/images");
});

app.get('/images', function (req, res) {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render('images', {data: items});
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