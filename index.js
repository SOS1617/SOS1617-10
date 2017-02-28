var dateformat=require("format-date");

function date(){
    var date= new Date();
    var day = dateformat('{day}',date);
    var valor="";
    switch (day) {
        case '1':
            valor="st";
            break;
        case '2':
            valor="nd";
            break;
        case '3':
            valor="rd";
            break;
        default:
            valor="th";
    }
    var res= dateformat('{day}',date)+valor+" "+dateformat('{month-name}',date)+" of "+dateformat('{year}',date)+", "+dateformat('{hours}:{minutes}:{seconds}');
    return res;
    
}






var express = require("express");

var port = (process.env.PORT || 16778);

var app = express();

app.get("/time",(req,res) =>{
    res.send("<html><h1>"+date()+"</h1></html>");

});

app.listen(port);

console.log("Server initialized on port " + port);



