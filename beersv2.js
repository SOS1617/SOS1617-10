var BASE_API_PATH = "/api/v2";




var MongoClientBeer = require('mongodb').MongoClient;

var mdbURLBeer = "mongodb://jesus:sosdatabase@ds137370.mlab.com:37370/beers-stats";

var dbBeer;

var apikey = "jesusguerre";

var request= require("request");


module.exports.register_beers_apiv2 = function(app) {
    

    MongoClientBeer.connect(mdbURLBeer, {
        native_parser: true
    }, function(err, database) {

        if (err) {
            console.log("CAN NOT CONEECT TO DB: " + err);
            process.exit(1);
        }

        dbBeer = database.collection("beers");

    });

    function CheckKey(key, response) {
        var valid = false;
        if (key == undefined) {
            console.log("ERROR: FORBIDEN. APIKEY DOESN'T PROVIDED.");
            response.sendStatus(401);
        }
        else if (key !== apikey) {
            console.log("ERROR: INCORRECT KEY");
            response.sendStatus(403);
        }
        else {
            valid = true;
        }
        return valid;

    }
    app.get(BASE_API_PATH + "/footballproxy", (req, res) => {
        var url = 'http://sos1617-11-.herokuapp.com/api/v1/lfppichichitrophy?apikey=adrdavand';
        req.pipe(request(url)).pipe(res);
    });


    // GET a collection
    app.get(BASE_API_PATH + "/beers-stats", function(request, response) {
        var limit = Number(request.query.limit);
        var offset = Number(request.query.offset);
        var yearfrom = request.query.from;
        var yearto = request.query.to;
        var keyprovided = request.query.apikey;
        var mongoquery = {};
        if (yearfrom == undefined) {
            yearfrom = 0;
        }
        if (yearto == undefined) {
            yearto = Number.POSITIVE_INFINITY;
        }
        mongoquery.$and = [{
            "birthyear": {
                "$gte": Number(yearfrom)
            }
        }, {
            "birthyear": {
                "$lte": Number(yearto)
            }
        }];

        console.log(mongoquery);
        if (CheckKey(keyprovided, response)) {
            console.log("INFO: New GET request to /beers-stats");
            dbBeer.find(mongoquery).limit(limit).skip(offset).toArray(function(err, beers) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var beersToSend = beers;
                    console.log("INFO: Sending beers: " + JSON.stringify(beersToSend, 2, null));
                    response.send(beersToSend);
                }
            });
        }
    });
    //GET loadInitialData

    app.get(BASE_API_PATH + "/beers-stats/loadInitialData", function(request, response) {
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            dbBeer.find({}).toArray(function(err, beers) {
                console.log(beers);
                if (err) {
                    console.error('Error while getting data from DB');
                }
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
                    }, {
                        "name": "Jupiler",
                        "country": "Belgium",
                        "birthyear": 1966,
                        "province": "Lieja"
                    }, {
                        "name": "Altbier",
                        "country": "Germany",
                        "birthyear": 1800,
                        "province": "Düsseldorf"
                    }, {
                        "name": "Grolsch",
                        "country": "Nerthelands",
                        "birthyear": 1615,
                        "province": "Enschede"
                    }, {
                        "name": "Birra Moretti",
                        "country": "Italy",
                        "birthyear": 1859,
                        "province": "Udine"
                    }, {
                        "name": "Sagres",
                        "country": "Portugal",
                        "birthyear": 1940,
                        "province": "Lisboa"
                    }, {
                        "name": "Fuller's",
                        "country": "United Kingdom",
                        "birthyear": 1845,
                        "province": "London"
                    }, {
                        "name": "Estrella Galicia",
                        "country": "Spain",
                        "birthyear": 1980,
                        "province": "La Coruña"
                    }, {
                        "name": "Estrella Damm",
                        "country": "Spain",
                        "birthyear": 1876,
                        "province": "Barcelona"
                    }, {
                        "name": "Alhambra",
                        "country": "Spain",
                        "birthyear": 1925,
                        "province": "Granada"
                    }, {
                        "name": "Cruzcampo",
                        "country": "Spain",
                        "birthyear": 1850,
                        "province": "Sevilla"
                    }];
                    console.log(beers);
                    dbBeer.insert(beers);
                    response.sendStatus(201);
                }
                else {
                    console.log("Beers has more size than 0");
                    response.sendStatus(200);
                }
            });
        }
    });
    // GET a single resource
    app.get(BASE_API_PATH + "/beers-stats/:parameter", function(request, response) {
        var parameter = request.params.parameter;
        var birthyear;
        var country;
        var limit = Number(request.query.limit);
        var offset = Number(request.query.offset);
        var keyprovided = request.query.apikey;
        var yearfrom = request.query.from;
        var yearto = request.query.to;
        var mongoquery = {}
        if (parameter == undefined) {
            console.log("WARNING: New GET request to /beers-stats/:country without country, sending 400...");
            response.sendStatus(400); // bad request
        }
        if (isNaN(parameter)) {
            mongoquery = {
                "country": parameter
            };
        }
        else {
            mongoquery = {
                "birthyear": Number(parameter)
            };
        }
        if (yearfrom == undefined) {
            yearfrom = 0;
        }
        if (yearto == undefined) {
            yearto = Number.POSITIVE_INFINITY;
        }
        mongoquery.$and = [{
            "birthyear": {
                "$gte": Number(yearfrom)
            }
        }, {
            "birthyear": {
                "$lte": Number(yearto)
            }
        }];
        if (CheckKey(keyprovided, response)) {
            console.log(mongoquery);
            console.log("INFO: New GET request to /beers-stats/" + country + " and birthyear " + birthyear);
            dbBeer.find(
                mongoquery
            ).skip(offset).limit(limit).toArray(function(err, filteredBeers) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    console.log(filteredBeers);
                    if (filteredBeers.length > 0) {
                        var beer = filteredBeers;
                        console.log("INFO: Sending beer: " + JSON.stringify(beer, 2, null));
                        response.send(beer);
                    }
                    else {
                        console.log("WARNING: There are not any country with " + country);
                        response.sendStatus(404); // not found
                    }
                }
            });


        }
    });
    //GET a single resource with 2 params
    app.get(BASE_API_PATH + "/beers-stats/:country/:birthyear", function(request, response) {
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            var birthyear = parseInt(request.params.birthyear);
            var country = request.params.country;
            var limit = request.query.limit;
            var offset = request.query.offset;
            var yearfrom = request.query.yearfrom;
            var yearto = request.query.yearto;
            if (!country && !birthyear) {
                console.log("WARNING: New GET request to /beers-stats/:country without country, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New GET request to /beers-stats/" + country);
                dbBeer.find({
                    "country": country,
                    "birthyear": birthyear
                }).toArray(function(err, filteredBeers) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (filteredBeers.length > 0) {
                            var beer = filteredBeers[0];
                            console.log(beer);
                            console.log("INFO: Sending beer: " + JSON.stringify(beer, 2, null));
                            response.send(beer);
                        }
                        else {
                            console.log("WARNING: There are not any country with " + country);
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });




    //POST over a collection
    app.post(BASE_API_PATH + "/beers-stats", function(request, response) {
        var newBeer = request.body;
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            if (!newBeer) {
                console.log("WARNING: New POST request to /beers-stats/ without name, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New POST request to /beers-stats with body: " + JSON.stringify(newBeer, 2, null));
                if (!newBeer.country || !newBeer.birthyear || !newBeer.province || !newBeer.name) {
                    console.log("WARNING: The beer " + JSON.stringify(newBeer, 2, null) + " is not well-formed, sending 422...");
                    response.sendStatus(422); // unprocessable entity
                }
                else {
                    dbBeer.find({
                        "country": newBeer.country,
                        "birthyear": newBeer.birthyear
                    }).toArray(function(err, BeersBeforeInsertion) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
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
        }
    });


    //POST over a single resource
    app.post(BASE_API_PATH + "/beers-stats/:country/:birthyear", function(request, response) {
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            var country = request.params.country;
            var birthyear = parseInt(request.params.birthyear);
            console.log("WARNING: New POST request to /beers-stats/" + country + ", sending 405...");
            response.sendStatus(405); // method not allowed
        }
    });


    //PUT over a collection
    app.put(BASE_API_PATH + "/beers-stats", function(request, response) {
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            console.log("WARNING: New PUT request to /beers, sending 405...");
            response.sendStatus(405); // method not allowed
        }
    });


    //PUT over a single resource
    app.put(BASE_API_PATH + "/beers-stats/:country/:birthyear", function(request, response) {
        var updatedBeer = request.body;
        var country = request.params.country;
        var birthyear = parseInt(request.params.birthyear);
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            if (!updatedBeer) {
                console.log("WARNING: New PUT request to /beers-stats/ without beer, sending 400...");
                response.sendStatus(400); // bad request
            }
            else if (country !== updatedBeer.country) {
                console.log("INFO: country changed");
                response.sendStatus(400);
            }
            else if (birthyear !== updatedBeer.birthyear) {
                console.log("INFO: birthyear changed");
                response.sendStatus(400);
            }
            else {
                console.log("INFO: New PUT request to /beers-stats/" + country + " and year " + birthyear + " with data " + JSON.stringify(updatedBeer, 2, null));
                if (!updatedBeer.country || !updatedBeer.birthyear || !updatedBeer.province || !updatedBeer.name) {
                    console.log("WARNING: The beer " + JSON.stringify(updatedBeer, 2, null) + " is not well-formed, sending 422...");
                    response.sendStatus(422); // unprocessable entity
                }
                else {
                    dbBeer.find({
                        "country": country,
                        "birthyear": birthyear
                    }).toArray(function(err, beersBeforeInsertion) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
                            console.log(beersBeforeInsertion)
                            if (beersBeforeInsertion.length > 0) {
                                dbBeer.update({
                                    "country": country,
                                    "birthyear": birthyear
                                }, updatedBeer);
                                console.log("INFO: Modifying beer with country " + country + " with data " + JSON.stringify(updatedBeer, 2, null));
                                response.send(updatedBeer); // return the updated Beer
                            }
                            else {
                                console.log("WARNING: There is not any beer with country " + country);
                                response.sendStatus(404); // not found
                            }
                        }
                    });
                }
            }
        }
    });


    //DELETE over a collection
    app.delete(BASE_API_PATH + "/beers-stats", function(request, response) {
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            console.log("INFO: New DELETE request to /beers-stats");
            dbBeer.remove({}, {
                multi: true
            }, function(err, result) {
                var numRemoved = JSON.parse(result);
                if (err) {
                    console.error('WARNING: Error removing data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (numRemoved.n > 0) {
                        console.log("INFO: All the Beers (" + numRemoved.n + ") have been succesfully deleted, sending 204...");
                        response.sendStatus(204); // no content
                    }
                    else {
                        console.log("WARNING: There are no contacts to delete");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    });


    //DELETE over a single resource
    app.delete(BASE_API_PATH + "/beers-stats/:country/:birthyear", function(request, response) {
        var country = request.params.country;
        var birthyear = parseInt(request.params.birthyear);
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            if (!country && !birthyear) {
                console.log("WARNING: New DELETE request to /beers-stats/:country without country, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New DELETE request to /beers-stats/" + country);
                dbBeer.remove({
                    country: country,
                    birthyear: birthyear
                }, {}, function(err, result) {
                    var numRemoved = JSON.parse(result);
                    if (err) {
                        console.error('WARNING: Error removing data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        console.log("INFO: Beers removed: " + numRemoved.n);
                        if (numRemoved.n === 1) {
                            console.log("INFO: The Beer with country " + country + " has been succesfully deleted, sending 204...");
                            response.sendStatus(204); // no content
                        }
                        else {
                            console.log("WARNING: There are no beer to delete");
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });
};
