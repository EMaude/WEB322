const mongoose = require("mongoose");
const schema = mongoose.Schema;

const connectString = "mongodb://a6u:123abcd@ds031591.mlab.com:31591/web322_a6"

const userSchema = new schema({

    "userName": {"type": String, "unique": true},
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});

let user;
module.exports.initialize = function(){
    return new Promise(function(resolve, reject)
    {
        let db = mongoose.createConnection(connectString);

        db.on('error', (err)=>{
            reject(err);
        });
        
        db.once('open', ()=>{
            user = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function(userData)
{
    return new Promise(function(resolve, reject){
        if(userData.password1 === userData.password2)
        {
            let newUser = new user(userData);
            newUser.save((err)=>{
                if(err.code === 11000){
                    reject("Username already taken");
                }
                else if(err)
                {
                    reject("Error creating user: " + err);
                }
                else
                {
                    resolve();
                }
            });
        }
        else
        {
            reject("Passwords do not match");
        }
    });
};

module.exports.checkUser = function(userData)
{
    return new Promise(function(resolve, reject){
        user.find({userName: userData.userName })
        .exec()
        .then((data)=>{
            if(data.length === 0)
            {
                reject("Unable to find user: " + userData.user);
            }
            else if(data[0].password != userData.password)
            {
                reject("Incorrect Password for user: " + data.userName)
            }
            else
            {
                data[0].push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                user.update({userName: data[0].username},
                    {$set: {loginHistory: data[0].loginHistory }}
                ).exec().then(()=>{
                    resolve(data[0]);
                }).catch((err)=>{
                    reject("There was a error verifying the user: " + err);
                });
            }
        }).catch((err)=>{
            reject("Unable to find user: " + userData.userName);
        });
    });
}

