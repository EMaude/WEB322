const http = require('http'); 
const express = require('express');
const url = require('url');
const path = require('path')

const app = express();
const port = process.env.PORT || 8080; 

app.use(express.static('public'));

app.listen(port, () => {
    console.log("Express http server listening on " + port);
});

app.get('/', function(req, res)
{
    res.sendfile("views/home.html");
});

app.get('/about', function(req, res)
{
    res.sendfile("views/about.html");
});