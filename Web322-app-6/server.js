
/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Elliot Maude Student ID: 032830127 Date: 2/21/18
*
* Online (Heroku) Link: https://young-caverns-24262.herokuapp.com/
********************************************************************************/

//node & npm
const http = require('http');
const express = require('express');
const url = require('url');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const clientSessions = require('client-sessions');

//custom
const data = require('./data-service.js');
const dataServiceAuth = require('./data-service-auth');

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
app.use(clientSessions({
    cookieName: "session",
    secret: "8Zct3FaZyuMAIl6Dnvz6zXRHbbr7APB7RfSipeN9DD0ZgrInBmWyyd4lFcr1b2f2VgMANt7KYTVbKopp", 
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(function(req, res, next) {
   res.locals.session = req.session;
   next();
});


function ensureLogin(req, res, next) 
{
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
}

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

app.get('/employees', ensureLogin, function (req, res) {
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status).then(function (ret) {
            if (ret) {
                res.render("employees", { employees: ret });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        }).catch(function (err) {
            res.render("employees", { message: "no results" });
        });
    }
    else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then(function (ret) {
            if (ret) {
                res.render("employees", { employees: ret });
            }
            else {
                res.render("employees", { message: "no results returned" });
            }
        }).catch(function (err) {
            res.render("employees", { message: "no results found" });
        });
    }
    else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager).then(function (ret) {
            if (ret) {
                res.render("employees", { employees: ret });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        }).catch(function (err) {
            res.render("employees", { message: "no results" });
        });
    }
    else {
        data.getAllEmployees().then(function (ret) {
            if (ret) {
                res.render("employees", { employees: ret });
            }
            else {
                res.render("employees", { message: "no results" });
            }
        }).catch(function (err) {
            res.render("employees", { message: "no results" });
        });
    }
});

app.get('/departments', ensureLogin, function (req, res) {
    data.getDepartments().then((ret) => {
        if (ret) {
            res.render("departments", { department: ret });
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

app.get('/employees/add', ensureLogin, function (req, res) {
    data.getDepartments().then(function(ret){
        res.render('addEmployee', {departments: ret});
    }).catch(function(){
        res.render('addEmployee', {departments: []});
    });
});

app.get('/images/add', ensureLogin, function (req, res) {
    res.render('addImage', {});
});

app.post('/images/add', ensureLogin, upload.single("imageFile"), function (req, res) {
    res.redirect("/images");
});

app.get('/images', ensureLogin, function (req, res) {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render('images', { data: items });
    });
});

app.post('/employees/add', ensureLogin, function (req, res) {
    data.addEmployee(req.body).then(() => {
        res.redirect('/employees');
    }).catch((err) => {
        res.status(500).send("Unable to Create Employee");
    });
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    data.getEmployeesByNum(req.params.empNum).then((ret) => {
        if (ret) {
            viewData.employee = ret; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(data.getDepartments)
        .then((ret) => {
            viewData.departments = ret; // store department data in the "viewData" object as "departments"
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

app.post("/employee/update", ensureLogin, (req, res) => {
    data.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    }).catch(err => {
        console.log("Something bad happend POST /employee/update");
        res.redirect("/employees");
    });
});

app.get("/departments/add", ensureLogin, (req, res) => {
    res.render('addDepartment', {});
});

app.post("/departments/add", ensureLogin, (req, res) => {
    data.addDepartment(req.body).then(() => {
        res.redirect('/departments');
    }).catch((err) => { throw err; });
});

app.post("/departments/update", ensureLogin, (req, res) => {
    data.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    }).catch(err => {
        console.log("Something bad happend POST /department/update");
        res.redirect("/departments");
    });
});

app.get("/department/:departmentId", ensureLogin, function (req, res) {
    data.getDepartmentsById(req.params.departmentId).then(function (ret) {
        if (ret) {
            res.render("department", { department: ret });
        } else {
            res.status(404).send("Department Data Not Found");
        }
    }).catch(function (msg) {
        res.status(404).send("Department Not Found");
    });
});

app.get("/employees/delete/:empNum", ensureLogin, function(req ,res){
    data.deleteEmployeeByNum(req.params.empNum).then(function(){
        res.redirect("/employees");
    }).catch(function(){
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});


app.get("/login", function(req, res) {
    res.render("login", { });
});

app.get("/register",  function(req, res){
    res.render("register",{});
});

app.get("/logout", function(req, res){
    req.session.reset();
    res.redirect("/");
});

app.get("/userHistory", ensureLogin, function(req, res){
    res.render("userHistory", {data: req.session.user});
});

app.post("/register", (req, res )=>{
    dataServiceAuth.registerUser(req.body)
    .then(()=>{
        res.render("register",{successMessage: "User created"});
    }).catch((err)=>{
        res.render("register", {errorMessage: err, userName: req.body.userName});
    });
});
 
app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');

    dataServiceAuth.checkUser(req.body).then((data)=>{
        req.session.user = {
            userName: data.userName,
            email: data.email,
            loginHistory: data.loginHistory
        };
        res.redirect('/employees');
    }).catch((err)=>{
        res.render("login", {errorMessage: err, userName: req.body.userName});
    });
});
  


//init 
data.initalize()
.then(dataServiceAuth.initialize)
.then(() => {
        app.listen(port, () => {
            console.log("Express http server listening on " + port);
        });
    }
).catch((err) => {
    console.log("unable to start server: " + err);
});