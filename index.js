"-----------------------------API BEERSTATS--------------------------------------------------------";
"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var DataStore = require('nedb');

var MongoClientBeer = require('mongodb').MongoClient;

var mdbURLBeer = "mongodb://jesus:sosdatabase@ds137370.mlab.com:37370/beers-stats";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var dbBeer;

MongoClientBeer.connect(mdbURLBeer, {
    native_parser: true
}, function(err, database) {

    if (err) {
        console.log("CAN NOT CONEECT TO DB: " + err);
        process.exit(1);
    }

    dbBeer = database.collection("beers");


    app.listen(port);
    console.log("Magic is happening on port " + port);

});

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


// Base GET
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /beers-stats");
    response.redirect(301, BASE_API_PATH + "/beers-stats");
});


// GET a collection
app.get(BASE_API_PATH + "/beers-stats", function(request, response) {
    console.log("INFO: New GET request to /beers-stats");
    dbBeer.find({}).toArray(function(err, beers) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            console.log("INFO: Sending beers: " + JSON.stringify(beers, 2, null));
            response.send(beers);
        }
    });
});

// GET a single resource
app.get(BASE_API_PATH + "/beers-stats/:name", function(request, response) {
            var name = request.params.name;
            if (!name) {
                console.log("WARNING: New GET request to /beers-stats/:name without country, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New GET request to /beers-stats/" + name);
                dbBeer.find({
                        "name": name
                    }, function(err, filteredBeers) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
                            if (filteredBeers.length > 0) {
                                var beer = filteredBeers[0]; //since we expect to have exactly ONE establishment with this country
                                console.log("INFO: Sending beer: " + JSON.stringify(beer, 2, null));
                                response.send(beer);
                            }
                            else if (name === "loadInitialData") {
                                var beers = dbBeer.find().toArray();
                                if (beers.length === 0) {
                                    beers = [{
                                        "name": "Kronenbourg",
                                        "country": "France",
                                        "birthyear": 1664,
                                        "province": "Strasbourg"
                                    }, {
                                        "name": "Chimay",
                                        "country": "Belgium",
                                        "birthyear": 1862,
                                        "province": "Hainaut"


                                    }];
                                    console.log(beers);
                                    db.insert(beers);
                                    response.sendStatus(201);
                                     }

                                }
                                else {
                                    console.log("WARNING: There are not any name with country " + name);
                                    response.sendStatus(404); // not found
                                }
                            }
                        });
                }
            });




        //POST over a collection
        app.post(BASE_API_PATH + "/name", function(request, response) {
            var newBeer = request.body;
            if (!newBeer) {
                console.log("WARNING: New POST request to /beers-stats/ without establishment, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New POST request to /beers-stats with body: " + JSON.stringify(newBeer, 2, null));
                if (!newBeer.country || !newBeer.birthyear || !newBeer.province || !newBeer.name) {
                    console.log("WARNING: The beer " + JSON.stringify(newBeer, 2, null) + " is not well-formed, sending 422...");
                    response.sendStatus(422); // unprocessable entity
                }
                else {
                    dbBeer.find({}, function(err, beers) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
                            var BeersBeforeInsertion = beers.filter((beer) => {
                                return (beer.country.localeCompare(newBeer.country, "en", {
                                    'sensitivity': 'base'
                                }) === 0);
                            });
                            if (BeersBeforeInsertion.length > 0) {
                                console.log("WARNING: The Beer " + JSON.stringify(newBeer, 2, null) + " already extis, sending 409...");
                                response.sendStatus(409); // conflict
                            }
                            else {
                                console.log("INFO: Adding Beer " + JSON.stringify(newBeer, 2, null));
                                dbBeer.insert(newBeer);
                                response.sendStatus(201); // created
                            }
                        }
                    });
                }
            }
        });


        //POST over a single resource
        app.post(BASE_API_PATH + "/beers-stats/:name", function(request, response) {
            var name = request.params.name;
            console.log("WARNING: New POST request to /beers-stats/" + name + ", sending 405...");
            response.sendStatus(405); // method not allowed
        });


        //PUT over a collection
        app.put(BASE_API_PATH + "/beers", function(request, response) {
            console.log("WARNING: New PUT request to /beers, sending 405...");
            response.sendStatus(405); // method not allowed
        });


        //PUT over a single resource
        app.put(BASE_API_PATH + "/beers-stats/:name", function(request, response) {
            var updatedBeer = request.body;
            var name = request.params.beer;
            if (!updatedBeer) {
                console.log("WARNING: New PUT request to /beers-stats/ without establishment, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New PUT request to /beers-stats/" + name + " with data " + JSON.stringify(updatedBeer, 2, null));
                if (!updatedBeer.country || !updatedBeer.birthyear || !updatedBeer.province || !updatedBeer.name) {
                    console.log("WARNING: The beer " + JSON.stringify(updatedBeer, 2, null) + " is not well-formed, sending 422...");
                    response.sendStatus(422); // unprocessable entity
                }
                else {
                    dbBeer.find({}, function(err, beers) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
                            var beersBeforeInsertion = beers.filter((beer) => {
                                return (beer.name.localeCompare(name, "en", {
                                    'sensitivity': 'base'
                                }) === 0);
                            });
                            if (beersBeforeInsertion.length > 0) {
                                dbBeer.update({
                                    name: name
                                }, updatedBeer);
                                console.log("INFO: Modifying beer with name " + name + " with data " + JSON.stringify(updatedBeer, 2, null));
                                response.send(updatedBeer); // return the updated Beer
                            }
                            else {
                                console.log("WARNING: There is not any beer with name " + name);
                                response.sendStatus(404); // not found
                            }
                        }
                    });
                }
            }
        });


        //DELETE over a collection
        app.delete(BASE_API_PATH + "/beers-stats", function(request, response) {
            console.log("INFO: New DELETE request to /beers-stats");
            dbBeer.remove({}, {
                multi: true
            }, function(err, numRemoved) {
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (numRemoved > 0) {
                        console.log("INFO: All the beers (" + numRemoved + ") have been succesfully deleted, sending 204...");
                        response.sendStatus(204); // no content
                    }
                    else {
                        console.log("WARNING: There are no beers to delete");
                        response.sendStatus(404); // not found
                    }
                }
            });
        });


        //DELETE over a single resource
        app.delete(BASE_API_PATH + "/beers-stats/:name", function(request, response) {
            var name = request.params.name;
            if (!name) {
                console.log("WARNING: New DELETE request to /beers-stats/:name without name, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New DELETE request to /beers-stats/" + name);
                dbBeer.remove({
                    name: name
                }, {}, function(err, numRemoved) {
                    if (err) {
                        console.error('WARNING: Error removing data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        console.log("INFO: beers removed: " + numRemoved);
                        if (numRemoved === 1) {
                            console.log("INFO: The beer with name " + name + " has been succesfully deleted, sending 204...");
                            response.sendStatus(204); // no content
                        }
                        else {
                            console.log("WARNING: There are no beers to delete");
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        });






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
                }, function(err, filteredEstablishments) {
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
                    db.find({}, function(err, establishments) {
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
                    db.find({}, function(err, establishments) {
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
            }, function(err, numRemoved) {
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (numRemoved > 0) {
                        console.log("INFO: All the establishments (" + numRemoved + ") have been succesfully deleted, sending 204...");
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
                }, {}, function(err, numRemoved) {
                    if (err) {
                        console.error('WARNING: Error removing data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        console.log("INFO: establishments removed: " + numRemoved);
                        if (numRemoved === 1) {
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
