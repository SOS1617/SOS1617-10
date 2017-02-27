var express = require("express");

var port = (process.env.PORT || 16778);

var app = express();

app.listen(port);

console.log("Server initialized on port " + port);
