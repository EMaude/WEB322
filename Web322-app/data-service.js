const Sequelize = require('sequelize');

const sequelize = new Sequelize('d3dcfh83m2srpd', 'kxzfymfrddgdra', '47d3c28d67fd5f8df1f224d232ad81016e0c07fe476180033a61e4a2d18a5844', {
 host: 'ec2-23-21-121-220.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: true
 }
});

const Employee = sequelize.define('Employee',{
    employeeNum:    {type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true},
    firstName:      Sequelize.STRING,
    lastName:       Sequelize.STRING,
    email:          Sequelize.STRING,
    SSN:            Sequelize.STRING,
    addressStreet:  Sequelize.STRING,
    addressPostal:  Sequelize.STRING,
    addressCity:    Sequelize.STRING,
    matitalStatus:  Sequelize.STRING,
    isManager:      Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status:         Sequelize.STRING,
    department:      Sequelize.INTEGER,
    hireDate:       Sequelize.STRING
 });

 const Department = sequelize.define('Department',{
     departmentId:      {type: Sequelize.INTEGER, primaryKey:true, autoIncrement:true},
     departmentName:    Sequelize.STRING,
 });

function initalize() {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function(){
            resolve();
        }).catch(function(){
            reject("Unable to connect to the database");
        });
    });   
}

function getAllEmployees() {
    return new Promise(function (resolve, reject) {
        Employee.findAll().then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });       
}

function getDepartments() {
    return new Promise(function (resolve, reject) {
        Department.findAll().then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
       });       
}

function addEmployee(data) {

    data.isManager = (data.isManager) ? true : false;
    console.log(data.isManager);

    for(var item in data)
    {
        if(data[item] == "")
        {
            data[item] = null;
        }
    }

    return new Promise(function (resolve, reject) {

        Employee.create({
            firstName:      data.firstName,
            lastName:       data.lastName,
            email:          data.email,
            SSN:            data.SSN,
            addressStreet:  data.addressStreet,
            addressPostal:  data.addressPostal,
            addressCity:    data.addressCity,
            matitalStatus:  data.matitalStatus,
            isManager:      data.isManager,
            employeeManagerNum: data.employeeManagerNum,
            status:         data.status,
            department:      data.department,
            hireDate:       data.hireDate
        }).then(function(){
            resolve();
        }).catch(function(){
            reject("Unable to create employee");
        })
    });   
}

function getEmployeesByStatus(query){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {status: query}
        }).then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
       });   
}

function getEmployeesByDepartment(query){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {department: query}
        }).then(function(data){
                resolve(data);
            }).catch(function(err){
                reject("no results returned");
            });
       });   
}
function getEmployeesByManager(query){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {employeeManagerNum: query}
        }).then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
       });   
}
function getEmployeesByNum(query){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {employeeNum: query}
        }).then(function(data){
                resolve(data[0]);
            }).catch(function(){
                reject("no results returned");
            });
       });   
}

function updateEmployee(data)
{
    return new Promise(function (resolve, reject) {
        data.isManager = (data.isManager) ? true : false;
        for(var item in data)
        {
            if(data[item] == "")
            {
                data[item] = null;
            }
        }
        Employee.update({
            firstName:      data.firstName,
            lastName:       data.lastName,
            email:          data.email,
            SSN:            data.SSN,
            addressStreet:  data.addressStreet,
            addressPostal:  data.addressPostal,
            addressCity:    data.addressCity,
            matitalStatus:  data.matitalStatus,
            isManager:      data.isManager,
            employeeManagerNum: data.employeeManagerNum,
            status:         data.status,
            department:      data.department,
            hireDate:       data.hireDate
        },{
            where: {EmployeeNum: data.employeeNum}
        }).then(function(){
            resolve();
        }).catch(function(){
            reject("Unable to update employee");
        })
       });   
}

function addDepartment(data)
{
    return new Promise(function (resolve, reject) {
        for(var item in data)
        {
            if(data[item] == "")
            {
                data[item] = null;
            }
        }
        Department.create(
            {
                departmentName:   data.departmentName,
            }
        ).then(function(){
            resolve();
        }).catch(function(){
            reject("Unable to create department");
        });
    });
}

function updateDepartment(data)
{
    return new Promise(function (resolve, reject) {

        for(var item in data)
        {
            if(data[item] == "")
            {
                data[item] = null;
            }
        }
        Department.update(
            {
                departmentName:   data.departmentName,
            },{
                where: {departmentId: data.departmentId}
            }   
        ).then(function(){
            resolve();
        }).catch(function(){
            reject("Unable to update department");
        });
    });
}

function getDepartmentsById(query)
{
    return new Promise(function(resolve, reject){
        Department.findAll({
            where: {departmentId: query}
        }).then(function(data){
            resolve(data[0]);
        }).catch(function(){
            reject("No result found");
        })
    });
}

function deleteEmployeeByNum(empNum){
    return new Promise(function(resolve, reject){
        Employee.destroy({
            where: {employeeNum: empNum}
        }).then(function(){
            resolve();
        }).catch(function(){
            reject("Could not delete");
        });
    });
}

exports.initalize = initalize;
exports.getAllEmployees = getAllEmployees;
exports.getDepartments = getDepartments;
exports.addEmployee = addEmployee;
exports.getEmployeesByStatus = getEmployeesByStatus;
exports.getEmployeesByDepartment = getEmployeesByDepartment;
exports.getEmployeesByManager = getEmployeesByManager;
exports.getEmployeesByNum = getEmployeesByNum;
exports.updateEmployee = updateEmployee;
exports.addDepartment = addDepartment;
exports.updateDepartment = updateDepartment;
exports.getDepartmentsById = getDepartmentsById;
exports.deleteEmployeeByNum = deleteEmployeeByNum;