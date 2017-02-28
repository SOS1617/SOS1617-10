var express = require("express");
var format = require('dateformat');

var port = (process.env.PORT || 16778);
var date = new Date();
var app = express();

//
app.get("/time",(req,res) => {
   res.send("<html><h1>"+format(date, "UTC:dS mmmm 'of' yyyy, HH:MM:ss")+"</h1></html>"); 
});

app.listen(port,(err) => {
    if(!err)
        console.log("Server initialized on port "+port);
    else
        console.log("ERROR initializing server on port "+port+ ":"+ err);
});


console.log("------------------------");  