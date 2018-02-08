var myPromise = new Promise(function(resolve, reject)
{
    if(false)
    {
        resolve("Success");
    }else
    {
        reject("Failed");
    }
});


myPromise.then((data) => {console.log(data)}).catch((err) => {console.log(err)});