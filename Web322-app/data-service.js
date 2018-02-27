const fs = require('fs');

var employees = new Array;
var departments = new Array;

function initalize() {
    return new Promise(function (resolve, reject) {
        fs.readFile("./data/employees.json", (err, data) => {
            if (err) {
                reject(new Error("Could not read employees.json"));
            }
            else {
                employees = JSON.parse(data);

                fs.readFile("./data/departments.json", (err, data) => {
                    if (err) {
                        reject(new Error("Could not read departments.json"));
                    }
                    else {
                        departments = JSON.parse(data);
                        resolve("Success");
                    }
                });
            }
        });
    });
};

function getAllEmployees() {
    return new Promise(function (resolve, reject) {
        if (employees.length > 0) {
            resolve(employees);
        }
        else {
            reject("Employee data not found");
        }
    });
};

function getManagers() {
    return new Promise(function (resolve, reject) {
        var managers = new Array;

        for (let i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                managers.push(employees[i]);
            }
        }

        if (managers.length > 0) {
            resolve(managers);
        }
        else {
            reject("Managers not found");
        }
    });
};

function getDepartments() {
    return new Promise(function (resolve, reject) {
        if (departments.length > 0) {
            resolve(departments);
        }
        else {
            reject("Department data not found");
        }
    });
};

function addEmployee(data) {
    return new Promise(function (resolve, reject) {
        if (data.isManager == undefined){
            data.isManager = false;
        } else { 
            data.isManager == true
        }

        data.employeeNum = employees.length + 1;

        employees.push(data);
        resolve();
    });
}
function getEmployeesByStatus(query){
    return new Promise(function (resolve, reject){
        let result = new Array;
        for(let i = 0; i < employees.length; i++)
        {
            if(employees[i].status.trim().toLowerCase().replace(/\s/g, "") == query.trim().toLowerCase().replace(/\s/g, ""))
            {
                result.push(employees[i]);
            }
        }

        if(result.length == 0)
        {
            reject("no results returned");
        }
        else{
            resolve(result);
        }
    });
}

function getEmployeesByDepartment(query){
    return new Promise(function (resolve, reject){
        let result = new Array;
        for(let i = 0; i < employees.length; i++)
        {
            if(employees[i].department == query)
            {
                result.push(employees[i]);
            }
        }
        if(result.length == 0)
        {
            reject("no results returned");
        }
        else{
            resolve(result);
        }
    });
}
function getEmployeesByManager(query){
    return new Promise(function (resolve, reject){
        let result = new Array;
        for(let i = 0; i < employees.length; i++)
        {
            if(employees[i].employeeManagerNum == query)
            {
                result.push(employees[i]);
            }
        }

        if(result.length == 0)
        {
            reject("no results returned");
        }
        else{
            resolve(result);
        }
    });
}
function getEmployeesByNum(query){
    return new Promise(function (resolve, reject){
        let result = new Array;
        for(let i = 0; i < employees.length; i++)
        {
            if(employees[i].employeeNum == query)
            {
                result.push(employees[i]);
            }
        }

        if(result.length == 0)
        {
            reject("no results returned");
        }
        else{
            resolve(result);
        }
    });
}

function updateEmployee(data)
{
    return new Promise(resolve, reject)
    {
        for(let i = 0; i , employees.length; i++)
        {
            if(employees[i].employeeNum == data.employeeNum)
            {
                employees[i] == data;
                resolve();
            }
        }
        revoke();
    };
}

exports.initalize = initalize;
exports.getAllEmployees = getAllEmployees;
exports.getManagers = getManagers;
exports.getDepartments = getDepartments;
exports.addEmployee = addEmployee;
exports.getEmployeesByStatus = getEmployeesByStatus;
exports.getEmployeesByDepartment = getEmployeesByDepartment;
exports.getEmployeesByManager = getEmployeesByManager;
exports.getEmployeesByNum = getEmployeesByNum;
exports.updateEmployee = updateEmployee;