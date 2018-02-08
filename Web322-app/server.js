const http = require('http'); 
const express = require('express');
const url = require('url');
const path = require('path');
const data = require('./data-service.js');

const app = express();
const port = process.env.PORT || 8080; 

app.use(express.static('public'));

app.get('/', function(req, res)
{
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get('/home', function(req, res)
{
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get('/about', function(req, res)
{
    res.sendFile(path.join(__dirname,"views/about.html"));
});

app.get('/employees', function(req, res)
{
    res.setHeader('Content-Type', 'application/json');
    data.getAllEmployees().then(function(data)
    {
       res.json(data);
    }).catch(function(err)
    {
        res.json({err: err});
    });
});

app.get('/departments', function(req, res)
{ 
    res.setHeader('Content-Type', 'application/json');
    data.getDepartments().then((data) =>
        {
            res.json(data);
        }
    ).catch((err) =>
        {
            res.json({error: err});
            console.log(err);
        }); 
});

app.get('/managers', function(req, res)
{
    res.setHeader('Content-Type', 'application/json');
    data.getManagers().then((data) =>
        {
            res.json(data);
        }
    ).catch((err) =>
        {
            res.json({error: err});
            console.log(err);
        });
});

data.initalize().then( 
        (result) =>
        {
            app.listen(port, () => {
                console.log("Express http server listening on " + port);
            });
        }
    ).catch((err) =>
    {
        console.log(err);
    });