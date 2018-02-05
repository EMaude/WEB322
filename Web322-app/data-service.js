const fs = require('fs');

var employees;
var departments;

var initalize = new Promise (function(resolve, reject)
{
    fs.readFile("./data/employees.json",  (err, data) =>
    {
        if(err)
        {
            reject("Could not real employees.json");
        }
        else
        {
            var employees = JSON.parse(data);

            fs.readFile("./data/departments.json", (err, data) =>
            {
                if(err)
                {
                    reject("Could not read departments.json");
                }
                else
                {
                    var departments = JSON.parse(data);
                     resolve("Success");
                }
            });
        }
    });
});

var getAllEmployees = new Promise(function(resolve, reject)
{
    if(employees.length > 0)
    {
        resolve(employees);
    }
    else
    {
        reject("Employee data not found");
    }
});

var getManagers = new Promise(function(resolve, reject)
{
    var managers = [];

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
});

var getDepartments = new Promise(function (resolve, reject)
{
    if(departments.length > 0)
    {
        resolve(departments);
    }
    else
    {
        reject("Department data not found");
    }
});

exports.initalize = initalize;
exports.getAllEmployees = getAllEmployees;
exports.getManagers = getManagers;
exports.getDepartments = getDepartments;