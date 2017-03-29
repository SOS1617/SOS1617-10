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
app.use("/api/v1/tests", express.static(path.join(__dirname, "tests")));

app.listen(port);
"-----------------------------API BEERSTATS--------------------------------------------------------";
var jesus = require('./beers.js');
jesus.register_beers_api(app);
"------------------------------------establishment----------------------------------------------------------------------------------";

"use strict";
/* global __dirname */

var MongoClient = require('mongodb').MongoClient;

var mdbURL = "mongodb://test:test@ds133450.mlab.com:33450/sos1617-10-sandbox";


var db;

MongoClient.connect(mdbURL, {
    native_parser: true
}, function(err, database) {

    if (err) {
        console.log("CAN NOT CONEECT TO DB: " + err);
        process.exit(1);
    }

    db = database.collection("establishments");


});


// Base GET
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /establishments");
    response.redirect(301, BASE_API_PATH + "/establishments");
});


// GET a collection
app.get(BASE_API_PATH + "/establishments", function(request, response) {
    console.log("INFO: New GET request to /establishments");
    db.find({}).toArray(function(err, establishments) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending establishments: " + JSON.stringify(establishments, 2, null));
            response.send(establishments);
        }
    });
});


// GET a single resource
app.get(BASE_API_PATH + "/establishments/:country", function(request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New GET request to /establishments/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /establishments/" + country);
        db.find({
            "country": country
        }).toArray(function(err, filteredEstablishments) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (filteredEstablishments.length > 0) {
                    var establishment = filteredEstablishments[0]; //since we expect to have exactly ONE establishment with this country
                    console.log("INFO: Sending establishment: " + JSON.stringify(establishment, 2, null));
                    response.send(establishment);
                }
                else if (country === "loadInitialData") {
                    db.find({}).toArray(function(err, establishment) {
                        console.log(establishment);
                        if (err) {
                            console.error('Error while getting data from DB');
                        }
                        if (establishment.length === 0) {
                            establishment = [{
                                "country": "belgium",
                                "year": 2014,
                                "number": 5139,
                                "beds": 366200,
                                "nights": 32600000
                            }, {
                                "country": "bulgaria",
                                "year": 2014,
                                "number": 3163,
                                "beds": 314300,
                                "nights": 21700000
                            }];
                            console.log(establishment);
                            db.insert(establishment);
                            response.sendStatus(201);
                        }
                        else {
                            console.log("Establishment has more size than 0");
                            response.sendStatus(200);
                        }
                    });


                }
                else {
                    console.log("WARNING: There are not any establishment with country " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//POST over a collection
app.post(BASE_API_PATH + "/establishments", function(request, response) {
    var newEstablishment = request.body;
    if (!newEstablishment) {
        console.log("WARNING: New POST request to /establishments/ without establishment, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /establishments with body: " + JSON.stringify(newEstablishment, 2, null));
        if (!newEstablishment.country || !newEstablishment.year || !newEstablishment.number || !newEstablishment.beds || !newEstablishment.nights) {
            console.log("WARNING: The establishment " + JSON.stringify(newEstablishment, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            db.find({}).toArray(function(err, establishments) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var establishmentsBeforeInsertion = establishments.filter((establishment) => {
                        return (establishment.country.localeCompare(newEstablishment.country, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (establishmentsBeforeInsertion.length > 0) {
                        console.log("WARNING: The establishment " + JSON.stringify(newEstablishment, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding establishment " + JSON.stringify(newEstablishment, 2, null));
                        db.insert(newEstablishment);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});

//POST over a single resource
app.post(BASE_API_PATH + "/establishments/:country", function(request, response) {
    var country = request.params.country;
    console.log("WARNING: New POST request to /establishments/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/establishments", function(request, response) {
    console.log("WARNING: New PUT request to /establishments, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/establishments/:country", function(request, response) {
    var updatedEstablishment = request.body;
    var country = request.params.country;
    if (!updatedEstablishment) {
        console.log("WARNING: New PUT request to /establishments/ without establishment, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /establishments/" + country + " with data " + JSON.stringify(updatedEstablishment, 2, null));
        if (!updatedEstablishment.country || !updatedEstablishment.year || !updatedEstablishment.number || !updatedEstablishment.beds || !updatedEstablishment.nights) {
            console.log("WARNING: The establishment " + JSON.stringify(updatedEstablishment, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            db.find({}).toArray(function(err, establishments) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var establishmentsBeforeInsertion = establishments.filter((establishment) => {
                        return (establishment.country.localeCompare(country, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (establishmentsBeforeInsertion.length > 0) {
                        db.update({
                            country: country
                        }, updatedEstablishment);
                        console.log("INFO: Modifying establishment with country " + country + " with data " + JSON.stringify(updatedEstablishment, 2, null));
                        response.send(updatedEstablishment); // return the updated establishment
                    }
                    else {
                        console.log("WARNING: There is not any establishment with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/establishments", function(request, response) {
    console.log("INFO: New DELETE request to /establishments");
    db.remove({}, {
        multi: true
    }, function(err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            if (numRemoved.n > 0) {
                console.log("INFO: All the establishments (" + numRemoved.n + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            }
            else {
                console.log("WARNING: There are no establishments to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});



//DELETE over a single resource
app.delete(BASE_API_PATH + "/establishments/:country", function(request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /establishments/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /establishments/" + country);
        db.remove({
            country: country
        }, {}, function(err, result) {
            var numRemoved = JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: establishments removed: " + numRemoved.n);
                if (numRemoved.n === 1) {
                    console.log("INFO: The establishment with country " + country + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no establishments to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});




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

    dbMotorcycling = database.collection("motorcyclings");


});


//loadInitialData
app.get(BASE_API_PATH + "/motorcycling-stats/loadInitialData", function(request, response) {
    dbMotorcycling.find({}).toArray(function(err, motorcycling) {
        console.log('INFO: Initialiting DB...');

        if (err) {
            console.error('WARNING: Error while getting initial data from DB');
            return 0;
        }

        if (motorcycling.length === 0) {
            console.log('INFO: Empty DB, loading initial data');

            var initialMotorcyclings = [{
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
            dbMotorcycling.insert(initialMotorcyclings);
            response.sendStatus(201);
        }
        else {
            console.log('INFO: DB has ' + motorcycling.length + ' motorcycling ');
            response.sendStatus(200);
        }
    });
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


// GET a single resource
app.get(BASE_API_PATH + "/motorcycling-stats/:country/:year", function(request, response) {
    var country = request.params.country;
    var year = parseInt(request.params.year);
    if (!country || !year) {
        console.log("WARNING: New GET request to /motorcycling-stats/:country/:year without country or year, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New GET request to /motorcycling-stats/" + country + "/" + year);
        dbMotorcycling.find({
            "country": country,
            "year": year
        }).toArray(function(err, filteredMotorcycling) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                if (filteredMotorcycling.length > 0) {
                    var motorcycling = filteredMotorcycling[0]; //since we expect to have exactly ONE motorcycling with this country or year
                    console.log("INFO: Sending motorcycling: " + JSON.stringify(motorcycling, 2, null));
                    response.send(motorcycling);
                }
                else {
                    console.log("WARNING: There are not motorcyclings");
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
app.post(BASE_API_PATH + "/motorcycling-stats/:country", function(request, response) {
    var country = request.params.country;
    console.log("WARNING: New POST request to /motorcycling-stats/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/motorcycling-stats", function(request, response) {
    console.log("WARNING: New PUT request to /motorcycling-stats, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/motorcycling-stats/:country/:year", function(request, response) {
    var updatedMotorcycling = request.body;
    var country = request.params.country;
    var year = Number(request.params.year);
    if (!updatedMotorcycling) {
        console.log("WARNING: New PUT request to /motorcycling-stats/ without content, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /motorcycling-stats/" + country + "/" + year + " with data " + JSON.stringify(updatedMotorcycling, 2, null));
        if (!country || !year) {
            console.log("WARNING: The motorcycling " + JSON.stringify(updatedMotorcycling, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbMotorcycling.find({
                "country": country,
                "year": year
            }).toArray(function(err, motorcyclingBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (motorcyclingBeforeInsertion.length > 0) {
                        dbMotorcycling.updateOne({
                            "country": country,
                            "year": year
                        }, {
                            $set: {
                                "pilot": updatedMotorcycling.pilot,
                                "team": updatedMotorcycling.team
                            }
                        });
                        console.log("INFO: Modifying motorcycling with country " + updatedMotorcycling.country + " with data " + JSON.stringify(updatedMotorcycling, 2, null));
                        response.send(updatedMotorcycling); // return the updated motorcycling
                    }
                    else {
                        console.log("WARNING: There are not any motorcycling with country " + updatedMotorcycling.country);
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
app.delete(BASE_API_PATH + "/motorcycling-stats/:country/:year", function(request, response) {
    var country = request.params.country;
    var year = Number(request.params.year);
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /motorcycling-stats/:country/:year without country or year, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /motorcycling-stats/" + country + "/" + year);
        dbMotorcycling.remove({
            "country": country,
            "year":year
        }, true, function(err, result) {
            var numRemoved = JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log("INFO: Countries removed: " + numRemoved.n);
                if (numRemoved.n === 1) {
                    console.log("INFO: The motorcycling with country " + country + "and year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }
                else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});
