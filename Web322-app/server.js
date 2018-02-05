const http = require('http'); 
const express = require('express');
const url = require('url');
const path = require('path');
const data = require('./data-service.js');

const app = express();
const port = process.env.PORT || 8080; 

app.use(express.static('public'));

app.all('/', function(req, res)
{
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.all('/home', function(req, res)
{
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.all('/about', function(req, res)
{
    res.sendFile(path.join(__dirname,"views/about.html"));
});

app.all('/employees', function(req, res)
{
    data.getAllEmployees.then
    (
        function(data)
        {
            res.json(data);
        }
    ).catch
    (
        function(err)
        {
            res.json({error: err});
            console.log(err);
        }
    );
});

app.all('/departments', function(req, res)
{
    data.getDepartments.then
    (
        function(data)
        {
            res.json(data);
        }
    ).catch
    (
        function(err)
        {
            res.json({error: err});
            console.log(err);
        }
    ); 
});

app.all('/managers', function(req, res)
{
    data.getManagers.then
    (
        function(data)
        {
            res.json(data);
        }
    ).catch
    (
        function(err)
        {
            res.json({error: err});
            console.log(err);
        }
    );
});

data.initalize
    .then( 
        function(result){
            app.listen(port, () => {
                console.log("Express http server listening on " + port);
            });
        }
    ).catch( function(err)
    {
        console.log(err);
    });