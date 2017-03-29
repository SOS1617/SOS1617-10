var MongoClient = require('mongodb').MongoClient;

var mdbURL = "mongodb://david:sosdavid@ds133290.mlab.com:33290/sos1617-10";

var BASE_API_PATH = "/api/v1";

var dbMotorcycling;

module.exports.register_motorcyclings_api = function(app) {

    MongoClient.connect(mdbURL, {
        native_parser: true
    }, function(err, database) {
        if (err) {
            console.log("CAN NOT CONNECT TO DB: " + err);
            process.exit(1);
        }

        dbMotorcycling = database.collection("motorcyclings");

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


// GET a single resource
app.get(BASE_API_PATH + "/motorcycling-stats/:parameter", function(request, response) {
    var parameter = request.params.parameter;
    var country;
    var year;
    if(isNaN(parameter)){
        country=parameter;
    }else{
        year=parseInt(parameter);
    }
    
   // var parametros=parameters(country,year);
    if (!country && !year) {
        console.log("WARNING: New GET request to /motorcycling-stats/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    }
    else if (!year){
            
        //console.log(parametros);
        console.log("INFO: New GET request to /motorcycling-stats/" + country + " and year " + year);
        dbMotorcycling.find({
            "country" : country
        }).toArray(function(err, filteredMotorcycling) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log(filteredMotorcycling);
                if (filteredMotorcycling.length > 0) {
                    var motor = filteredMotorcycling;
                    console.log("INFO: Sending motor: " + JSON.stringify(motor, 2, null));
                    response.send(motor);
                }
                else {
                    console.log("WARNING: There are not any country with " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
        
    }
    else{
        //console.log(parametros);
        console.log("INFO: New GET request to /motorcycling-stats/" + country + " and year " + year);
        dbMotorcycling.find({
            "year" : year
        }).toArray(function(err, filteredMotorcycling) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
                console.log(filteredMotorcycling);
                if (filteredMotorcycling.length > 0) {
                    var motor = filteredMotorcycling;
                    console.log("INFO: Sending motor: " + JSON.stringify(motor, 2, null));
                    response.send(motor);
                }
                else {
                    console.log("WARNING: There are not any country with " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
        
    }
        
    }
);
//GET a single resource with 2 params
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
app.post(BASE_API_PATH + "/motorcycling-stats/:country/:year", function(request, response) {
    var country = request.params.country;
    var year = parseInt(request.params.year);
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
    var year = parseInt(request.params.year);
    console.log();
    if (!updatedMotorcycling) {
        console.log("WARNING: New PUT request to /motorcycling-stats/ without motorcycling, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /motorcycling-stats/" + country +" and year "+ year +" with data " + JSON.stringify(updatedMotorcycling, 2, null));
        if (!updatedMotorcycling.pilot || !updatedMotorcycling.country || !updatedMotorcycling.year || !updatedMotorcycling.team) {
            console.log("WARNING: The motorcycling " + JSON.stringify(updatedMotorcycling, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbMotorcycling.find({"country": country,"year":year}).toArray(function(err, motorcyclingBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (motorcyclingBeforeInsertion.length > 0) {
                        dbMotorcycling.update({
                            "country": country,
                            "year" : year
                        }, updatedMotorcycling);
                        console.log("INFO: Modifying motorcycling with country " + country + " with data " + JSON.stringify(updatedMotorcycling, 2, null));
                        response.send(updatedMotorcycling); // return the updated motorcycling
                    }
                    else {
                        console.log("WARNING: There is not any motorcycling with country " + country);
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

    console.log("Registered API establishments");
};