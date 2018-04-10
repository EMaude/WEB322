const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const schema = mongoose.Schema;

const connectString = "mongodb://a6u:1234abcd@ds031591.mlab.com:31591/web322_a6"

const userSchema = new schema({

    "userName": { "type": String, "unique": true },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": String,
        "userAgent": String
    }]
});

let User;
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(connectString);

        db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData)
{
    return new Promise(function (resolve, reject)
    {

        if (userData.password === userData.password2)
        {
            bcrypt.genSalt(10, function (err, salt)
            {
                bcrypt.hash(userData.password, salt, function (err, hash) 
                {
                    if (err) 
                    {
                        reject("There was an error encrypting the password");
                    }
                    userData.password = hash;

                    let newUser = new User(userData);

                    newUser.save((err) => {
                        if (err) {
                            if (err.code === 11000) {
                                reject("Username already taken");
                            } else {
                                reject("Error creating user: " + err);
                            }
                        }
                        else {
                            resolve();
                        }
                    });

                });
            });
        }
        else {
            reject("Passwords do not match");
        }
    });
};

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName })
            .exec()
            .then((data) => {
                if (data.length == 0) {
                    reject("No results returned for user: " + userData.user);
                }

                bcrypt.compare(userData.password, data[0].password).then((res) => {
                    if (res === false) {
                        reject("Incorrect password for user: " + data[0].userName)
                    }
                    else {
                        data[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });

                        User.update({ userName: data[0].userName },
                            { $set: { loginHistory: data[0].loginHistory } }, { multi: false })
                            .exec().then(() => {
                                resolve(data[0]);
                            }).catch((err) => {
                                reject("There was a error verifying the user: " + err);
                            });
                    }
                });
            }).catch((err) => {
                reject("Unable to find user: " + userData.userName);
            });
    });
}
