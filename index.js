var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

app.use("/", express.static(path.join(__dirname, "public")));

app.use(BASE_API_PATH + "/tests", express.static(path.join(__dirname, "tests")));

app.listen(port);

"-----------------------------API BEERSTATS--------------------------------------------------------";

var jesus = require('./beers');

jesus.register_beers_api(app);


"------------------------------------establishment-------------------------------------------------";

var establishments = require('./establishments');

establishments.register_establishments_api(app);


"------------------------------------motorcycling-stats---------------------------------------------------------------------------------";

"-----------------------------API BEERSTATS--------------------------------------------------------";
var david = require('./motorcyclings.js');
david.register_motorcyclings_api(app);

