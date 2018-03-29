
/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Elliot Maude Student ID: 032830127 Date: 2/21/18
*
* Online (Heroku) Link: https://young-caverns-24262.herokuapp.com
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
        navLink: function (url, options) {
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

app.use(function (req, res, next) {
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
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status).then(function (data) {
            if (data) {
                res.render("employees", { employees: data });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        }).catch(function (err) {
            res.render("employees", { message: "no results" });
        });
    }
    else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then(function (data) {
            if (data) {
                res.render("employees", { employees: data });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        }).catch(function (err) {
            res.render("employees", { message: "no results" });
        });
    }
    else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager).then(function (data) {
            if (data) {
                res.render("employees", { employees: data });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        }).catch(function (err) {
            res.render("employees", { message: "no results" });
        });
    }
    else {
        data.getAllEmployees().then(function (data) {
            if (data) {
                res.render("employees", { employees: data });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        }).catch(function (err) {
            res.render("employees", { message: "no results" });
        });
    }
});

app.get('/departments', function (req, res) {
    data.getDepartments().then((data) => {
        if (data) {
            res.render("departments", { department: data });
        }
        else {
            res.render("departments", { message: "no results" });
        }
    }
    ).catch((err) => {
        res.render("departments", { message: "no results" });
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
    data.getDepartments().then(function(data){
        res.render('addEmployee', {departments: data});
    }).catch(function(){
        res.render('addEmployee', {departments: []});
    });
});

app.get('/images/add', function (req, res) {
    res.render('addImage', {});
});

app.post('/images/add', upload.single("imageFile"), function (req, res) {
    res.redirect("/images");
});

app.get('/images', function (req, res) {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render('images', { data: items });
    });
});

app.post('/employees/add', function (req, res) {
    data.addEmployee(req.body).then(() => {
        res.redirect('/employees');
    }).catch((err) => {
        res.status(500).send("Unable to Create Employee");
    });
});

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    data.getEmployeesByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(data.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch(err => {
        console.log("Something bad happend POST /employee/update");
        res.redirect("/employees");
    });
});

app.get("/departments/add", (req, res) => {
    res.render('addDepartment', {});
});

app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body).then(() => {
        res.redirect('/departments');
    }).catch((err) => { throw err; });
});

app.post("/departments/update", (req, res) => {
    data.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    }).catch(err => {
        console.log("Something bad happend POST /department/update");
        res.redirect("/departments");
    });
});

app.get("/department/:departmentId", function (req, res) {
    data.getDepartmentsById(req.params.departmentId).then(function (data) {
        if (data) {
            res.render("department", { department: data });
        } else {
            res.status(404).send("Department Not Found");
        }
    }).catch(function () {
        res.status(404).send("Department Not Found");
    });
});

app.get("/employees/delete/:empNum", function(req ,res){
    data.deleteEmployeeByNum(req.params.empNum).then(function(){
        res.redirect("/employees");
    }).catch(function(){
        res.status(500).send("Unable to Remove Employee / Employee not found");
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