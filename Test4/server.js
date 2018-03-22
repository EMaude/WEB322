/*
use pg.pool for everything becasue pg.connect is hard deprecated https://node-postgres.com/guides/upgrading
*/

const express = require('express');
const pg = require('pg')

const app = express();

const config = {
    host: 'ec2-54-243-185-195.compute-1.amazonaws.com',
    user: 'fvjedsngezcysy',
    database: 'da72sm1e1slod8',
    password: 'e39e63774c46c11201a7d3be6bef29c96cf487ea904fff49a9ea16edb938f11c',
    port: 5432,
    ssl: true,
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
};

const pool = new pg.Pool(config);

const PORT = process.env.PORT || 8080;

app.get('/', function (req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        client.query('SELECT * FROM employee where empid = 1', function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
                res.status(200).send(result.rows);
            });
    });
});

app.get('/sp', function (req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        client.query('SELECT * from GetAllEmployee()', function (err, result) {
            done(); // closing the connection;
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        })
    })
});

app.get('/pool', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        client.query('SELECT * from GetAllEmployee()', function (err, result) {
            //call `done()` to release the client back to the pool
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        })
    })
});

app.listen(PORT, function () {
    console.log('Server is running on Port: '  + PORT);
});