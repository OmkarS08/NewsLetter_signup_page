const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express()
const https = require("https");

/******************************************* */
app.use(express.static("Public")); // To use Public files for eg images and css
app.use(bodyParser.urlencoded({ extended: true })) //default to be written to use body parser


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html") //dirname is for get the the directory address to the file
})
app.post("/", function(req, res) {
    const fn = req.body.fname; // fname sname email is the name given to the form so we can use it with dot notation
    const ln = req.body.Sname;
    const email = req.body.email;

    console.log(fn, ln, email);


    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fn,
                LNAME: ln,
            }
        }]
    };
    //data that must be sent to mailchimp in Json format. look for API documentation for the same
    const jsonData = JSON.stringify(data);
    //converting JsOn data to string

    const url = "https://us14.api.mailchimp.com/3.0/lists/3563e7aac9"; //api url
    const option = {
            method: "POST",
            auth: "Omkar1:31ccaf4100ea82fa6eed69fd6cb3ff48-us14"
        }
        //authentication and to use post method

    const req1 = https.request(url, option, function(response) {

            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
            //to check if things are correct
            response.on("data", function(data) {
                console.log(JSON.parse(data));
            })
        })
        //making hhtps request to get the response from the server.

    req1.write(jsonData);
    // the same request can be used to write the data to api
    req1.end();
    // req.end() should be used to complete the request or end the request.

    app.post("/failure", function(req, res) {
        res.redirect("/");
    })
})
app.listen(process.env.PORT || 3000, function() {
    console.log("connected to server 3000")
})

//api key
//31ccaf4100ea82fa6eed69fd6cb3ff48-us14
//3563e7aac9
//