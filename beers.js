var BASE_API_PATH = "/api/v1";


var MongoClientBeer = require('mongodb').MongoClient;

var mdbURLBeer = "mongodb://jesus:sosdatabase@ds137370.mlab.com:37370/beers-stats";

var dbBeer;

var apikey = "sos1617-jesusguerre";

module.exports.register_beers_api = function(app) {

    MongoClientBeer.connect(mdbURLBeer, {
        native_parser: true
    }, function(err, database) {

        if (err) {
            console.log("CAN NOT CONEECT TO DB: " + err);
            process.exit(1);
        }

        dbBeer = database.collection("beers");

    });

    function Search(yearfrom, yearto) {
        return (object) => {
            if (yearfrom != undefined && yearto == undefined) {
                return object.birthyear >= yearfrom;

            }
            else
            if (yearfrom == undefined && yearto != undefined) {
                return object.birthyear <= yearto;
            }
            else
            if (yearfrom != undefined && yearto != undefined) {
                return object.birthyear <= yearto && object.birthyear >= yearfrom;

            }
            else
            if (yearfrom == undefined && yearto == undefined) {
                return object;
            }
        };
    }



    function Paginate(data, limit, offset) {
        var page = [];
        var cont = 0;
        if (limit === undefined) {
            limit = data.length;
        }
        if (offset === undefined) {
            offset = 0;
        }
        if (offset > data.length) {
            console.log("Offset out of the array!");
            app.sendStatus(400);
        }
        else {
            for (var j = offset; j < data.length; j++) {
                if (limit>cont) {
                    page.push(data[j]);
                    cont++;
                }
            }
        }
        return page;

    }

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


    // GET a collection
    app.get(BASE_API_PATH + "/beers-stats", function(request, response) {
        var limit = request.query.limit;
        var offset = request.query.offset;
        var yearfrom = request.query.from;
        var yearto = request.query.to;
        var keyprovided = request.query.apikey;
        if (CheckKey(keyprovided, response)) {
            console.log("INFO: New GET request to /beers-stats");
            dbBeer.find({}).toArray(function(err, beers) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var beersToSend = Paginate(beers, limit, offset).filter(Search(yearfrom, yearto));
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
        var limit = request.query.limit;
        var offset = request.query.offset;
        var keyprovided = request.query.apikey;
        var yearfrom = request.query.yearfrom;
        var yearto = request.query.yearto;
        if (CheckKey(keyprovided, response)) {
            if (isNaN(parameter)) {
                country = parameter;
            }
            else {
                birthyear = parseInt(parameter);
            }
            if (!country && !birthyear) {
                console.log("WARNING: New GET request to /beers-stats/:country without country, sending 400...");
                response.sendStatus(400); // bad request
            }
            else if (!birthyear) {
                console.log("INFO: New GET request to /beers-stats/" + country + " and birthyear " + birthyear);
                dbBeer.find({
                    "country": country
                }).toArray(function(err, filteredBeers) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        console.log(filteredBeers);
                        if (filteredBeers.length > 0) {
                            var beer = Paginate(filteredBeers, limit, offset).filter(Search(yearfrom, yearto));
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
            else {
                console.log("INFO: New GET request to /beers-stats/" + country + " and birthyear " + birthyear);
                dbBeer.find({
                    "birthyear": birthyear
                }).toArray(function(err, filteredBeers) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        console.log(filteredBeers);
                        if (filteredBeers.length > 0) {
                            var beer = Paginate(filteredBeers, limit, offset).filter(Search(yearfrom, yearto));
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
                            var beer = Paginate(filteredBeers, limit, offset).filter(Search(yearfrom, yearto));
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
