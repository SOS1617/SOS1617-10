var express = require("express");
var format = require('dateformat');
var path = require("path");

var port = (process.env.PORT || 16778);
var date = new Date();
date.setHours(date.getHours()+1);
var app = express();

//Return the current day and time of the server in the format: "1st March of 2017, 08:35:00"
app.get("/time",(req,res) => {
   res.send("<html><h1>"+format(date, "dS mmmm 'of' yyyy, HH:MM:ss")+"</h1></html>"); 
});

//Shtatic files folder at "/"
app.use("/", express.static(path.join(__dirname,"public")));

app.listen(port,(err) => {
    if(!err)
        console.log("Server initialized on port "+port);
    else
        console.log("ERROR initializing server on port "+port+ ":"+ err);
});


console.log("------------------------");  