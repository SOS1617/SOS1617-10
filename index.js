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
app.get(BASE_API_PATH + "/tests", (req, res) => {
    res.sendFile(path.join(__dirname, "tests/index.html"));
});

app.listen(port, () => {
    console.log("Magic is happening in port" + port);
}).on("error", (e) => {
    console.log("Server can not be started" + e);
    process.exit(1);
});

"-----------------------------API BEERSTATS--------------------------------------------------------";

var jesus = require('./beers');

jesus.register_beers_api(app);


"------------------------------------establishment-------------------------------------------------";

var establishments = require('./establishments');

establishments.register_establishments_api(app);


"------------------------------------motorcycling-stats---------------------------------------------------------------------------------";

"use strict";
/* global __dirname */

var MongoClient = require('mongodb').MongoClient;

var mdbURL = "mongodb://david:sosdavid@ds133290.mlab.com:33290/sos1617-10";


var dbMotorcycling;

MongoClient.connect(mdbURL, {
    native_parser: true
}, function(err, database) {
    if (err) {
        console.log("CAN NOT CONEECT TO DB: " + err);
        process.exit(1);
    }

    dbMotorcycling = database.collection("motorcycling");


});


// Base GET
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /motorcycling-stats");
    response.redirect(301, BASE_API_PATH + "/motorcycling-stats");
});


// GET a collection
app.get(BASE_API_PATH + "/motorcycling-stats", function(request, response) {
    console.log("INFO: New GET request to /motorcycling-stats");
    dbMotorcycling.find({}).toArray(function(err, motorcycling) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending motorcycling: " + JSON.stringify(motorcycling, 2, null));
            response.send(motorcycling);
        }
    });
});


// GET a single resource (pilot)
app.get(BASE_API_PATH + "/motorcycling-stats/:pilot", function(request, response) {
    var pilot = request.params.pilot;
    if (!pilot) {
        console.log("WARNING: New GET request to /motorcycling-stats/:pilot without pilot, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /motorcycling-stats/" + pilot);
        dbMotorcycling.find({
            "pilot": pilot
        }).toArray(function(err, filteredMotorcycling) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (filteredMotorcycling.length > 0) {
                    var motorcycling = filteredMotorcycling; //since we expect to have exactly ONE motorcycling with this pilot
                    console.log("INFO: Sending motorcycling: " + JSON.stringify(motorcycling, 2, null));
                    response.send(motorcycling);
                }
                else if (pilot === "loadInitialData") {
                    dbMotorcycling.find({}).toArray(function(err, motorcycling) {
                        console.log(motorcycling);
                        if (err) {
                            console.error('Error while getting data from DB');
                        }
                        if (motorcycling.length === 0) {
                            motorcycling = [{
                                "pilot": "Leslie Graham",
                                "country": "United Kingdom",
                                "year": 1949,
                                "team": "AJS"
                            }, {
                                "pilot": "Valentino Rossi",
                                "country": "Italy",
                                "year": 2004,
                                "team": "Yamaha"
                            }, {
                                "pilot": "Valentino Rossi",
                                "country": "Italy",
                                "year": 2005,
                                "team": "Yamaha"
                            }, {
                                "pilot": "Marquez",
                                "country": "Italy",
                                "year": 2015,
                                "team": "Yamaha"
                            }, {
                                "pilot": "Marquez",
                                "country": "Italy",
                                "year": 2016,
                                "team": "Yamaha"
                            }];
                            console.log(motorcycling);
                            dbMotorcycling.insert(motorcycling);
                            response.sendStatus(201);
                        }
                        else {
                            console.log("Motorcycling has more size than 0");
                            response.sendStatus(200);
                        }
                    });


                }
                else {
                    console.log("WARNING: There are not any name with pilot " + pilot);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//POST over a collection
app.post(BASE_API_PATH + "/motorcycling-stats", function(request, response) {
    var newMotorcycling = request.body;
    if (!newMotorcycling) {
        console.log("WARNING: New POST request to /motorcycling/ without motorcycling, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /motorcycling with body: " + JSON.stringify(newMotorcycling, 2, null));
        if (!newMotorcycling.pilot || !newMotorcycling.country || !newMotorcycling.year || !newMotorcycling.team) {
            console.log("WARNING: The motorcycling " + JSON.stringify(newMotorcycling, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbMotorcycling.find({}).toArray(function(err, motorcycling) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var motorcyclingBeforeInsertion = motorcycling.filter((motor) => {
                        return (motor.country.localeCompare(newMotorcycling.country, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (motorcyclingBeforeInsertion.length > 0) {
                        console.log("WARNING: The motor " + JSON.stringify(newMotorcycling, 2, null) + " already exist, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding motor " + JSON.stringify(newMotorcycling, 2, null));
                        dbMotorcycling.insert(newMotorcycling);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/motorcycling-stats/:pilot", function(request, response) {
    var pilot = request.params.pilot;
    console.log("WARNING: New POST request to /motorcycling-stats/" + pilot + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/motorcycling-stats", function(request, response) {
    console.log("WARNING: New PUT request to /motorcycling-stats, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/motorcycling-stats/:pilot", function(request, response) {
    var updatedMotorcycling = request.body;
    var pilot = request.params.pilot;
    if (!updatedMotorcycling) {
        console.log("WARNING: New PUT request to /motorcycling-stats/ without motorcycling, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /motorcycling-stats/" + pilot + " with data " + JSON.stringify(updatedMotorcycling, 2, null));
        if (!updatedMotorcycling.pilot || !updatedMotorcycling.country || !updatedMotorcycling.year || !updatedMotorcycling.team) {
            console.log("WARNING: The motorcycling " + JSON.stringify(updatedMotorcycling, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbMotorcycling.find({}).toArray(function(err, motorcycling) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var motorcyclingBeforeInsertion = motorcycling.filter((motor) => {
                        return (motor.pilot.localeCompare(pilot, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (motorcyclingBeforeInsertion.length > 0) {
                        dbMotorcycling.update({
                            pilot: pilot
                        }, updatedMotorcycling);
                        console.log("INFO: Modifying motor with pilot " + pilot + " with data " + JSON.stringify(updatedMotorcycling, 2, null));
                        response.send(updatedMotorcycling); // return the updated motor
                    }
                    else {
                        console.log("WARNING: There is not any motor with pilot " + pilot);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});



//DELETE over a collection
app.delete(BASE_API_PATH + "/motorcycling-stats", function(request, response) {
    console.log("INFO: New DELETE request to /motorcycling-stats");
    dbMotorcycling.remove({}, {
        multi: true
    }, function(err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            if (numRemoved.n > 0) {
                console.log("INFO: All the motorcycling (" + numRemoved.n + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no motorcycling to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/motorcycling-stats/:pilot", function(request, response) {
    var pilot = request.params.pilot;
    if (!pilot) {
        console.log("WARNING: New DELETE request to /motorcycling-stats/:pilot without pilot, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /motorcycling-stats/" + pilot);
        dbMotorcycling.remove({
            pilot: pilot
        }, {}, function(err, result) {
            var numRemoved = JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: motorcycling removed: " + numRemoved.n);
                if (numRemoved.n === 1) {
                    console.log("INFO: The motorcycling with pilot " + pilot + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no motorcycling to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});
