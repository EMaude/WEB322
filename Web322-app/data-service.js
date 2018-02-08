const fs = require('fs');

var employees = new Array;
var  departments = new Array;

function initalize(){return new Promise (function(resolve, reject)
    {
        fs.readFile("./data/employees.json",  (err, data) =>
        {
            if(err)
            {
                reject(new Error("Could not read employees.json"));
            }
            else
            {
                employees = JSON.parse(data);

                fs.readFile("./data/departments.json", (err, data) =>
                {
                    if(err)
                    {
                        reject(new Error("Could not read departments.json"));
                    }
                    else
                    {
                        departments = JSON.parse(data);
                        resolve("Success");
                    }
                });
            }
        });
    });
};

function getAllEmployees()  {return new Promise(function(resolve, reject)
{
    if(employees.length > 0)
    {
        resolve(employees);
    }
    else
    {
        reject("Employee data not found");
    }
});};

function getManagers() { return new Promise(function(resolve, reject)
{
    var managers = new Array;

    for(let i = 0; i < employees.length; i++)
    {
        if(employees[i].isManager == true)
        {
            managers.push(employees[i]);
        }
    }

    if(managers.length > 0)
    {
        resolve(managers);
    }
    else
    {
        reject("Managers not found");
    }
});};

function getDepartments() {return new Promise(function(resolve, reject)
{
    if(departments.length > 0)
    {
        resolve(departments);
    }
    else
    {
        reject("Department data not found");
    }
});};

exports.initalize = initalize;
exports.getAllEmployees = getAllEmployees;
exports.getManagers = getManagers;
exports.getDepartments = getDepartments;