var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var cors = require("cors");
var request= require("request");
//var cors = require("cors");

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var app = express();
   

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security
app.use(cors());

app.use("/", express.static(path.join(__dirname, "public")));

app.use(BASE_API_PATH + "/tests", express.static(path.join(__dirname, "tests")));

app.listen(port,() =>{
        console.log("Magic is happening on port " + port);
    });
"-----------------------------API BEERSTATS--------------------------------------------------------";

var jesus = require('./beers');

jesus.register_beers_api(app);

var jesusv2 = require('./beersv2');

jesusv2.register_beers_apiv2(app);


"------------------------------------establishment-------------------------------------------------";

var establishments = require('./establishments');

establishments.register_establishments_api(app);

var establishmentsv2 = require('./establishmentsv2');

establishmentsv2.register_establishments_apiv2(app);


"------------------------------------motorcycling-stats---------------------------------------------------------------------------------";

var david = require('./motorcyclings');

david.register_motorcyclings_api(app);

var davidv2 = require('./motorcyclingsv2');

davidv2.register_motorcyclings_apiv2(app);

