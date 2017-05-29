var MongoClient = require('mongodb').MongoClient;

var mdbURL = "mongodb://test:test@ds133450.mlab.com:33450/sos1617-10-sandbox";

var BASE_API_PATH = "/api/v2";

var db;

var apikey = "nurtrioje";

var request = require("request");

var unirest = require('unirest');

module.exports.register_establishments_apiv2 = function(app) {

    MongoClient.connect(mdbURL, {
        native_parser: true
    }, function(err, database) {
        if (err) {
            console.log("CAN NOT CONNECT TO DB: " + err);
            process.exit(1);
        }

        db = database.collection("establishments");

    });

    function checkApikey(key, response) {
        var ret = true;
        if (key === undefined) {
            response.sendStatus(401);
            ret = false;
        }
        else if (key !== apikey) {
            response.sendStatus(403);
            ret = false;
        }
        else {
            console.log("INFO: Correct apikey");
        }
        return ret;
    }

    // PROXY
    app.get(BASE_API_PATH + "/salariesproxy", (req, res) => {
        var url = 'http://sos1617-07.herokuapp.com/api/v1/salaries/?apikey=sos07';
        req.pipe(request(url)).pipe(res);
    });

    app.get(BASE_API_PATH + "/restcountries", (req, res) => {
        unirest.get("https://restcountries-v1.p.mashape.com/all")
            .header("X-Mashape-Key", "ZnH7znsTzmmsh4MEw7mMggJzpjbAp1xzVMWjsn6ltYcEZEomEO")
            .header("Accept", "application/json")
            .end(function(result) {
                res.send(result.body);
            });
    });

    //loadInitialData
    app.get(BASE_API_PATH + "/establishments/loadInitialData", function(request, response) {
        var key = request.query.apikey;
        if (checkApikey(key, response)) {
            db.find({}).toArray(function(err, establishments) {
                console.log('INFO: Initialiting DB...');

                if (err) {
                    console.error('WARNING: Error while getting initial data from DB');
                    return 0;
                }

                if (establishments.length === 0) {
                    console.log('INFO: Empty DB, loading initial data');

                    var initialEstablishments = [{
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
                    }, {
                        "country": "czech republic",
                        "year": 2014,
                        "number": 9013,
                        "beds": 710400,
                        "nights": 42900000
                    }, {
                        "country": "denmark",
                        "year": 2014,
                        "number": 1118,
                        "beds": 420000,
                        "nights": 29600000
                    }, {
                        "country": "germany",
                        "year": 2014,
                        "number": 50925,
                        "beds": 3318600,
                        "nights": 366500000
                    }, {
                        "country": "estonia",
                        "year": 2014,
                        "number": 1419,
                        "beds": 58100,
                        "nights": 5800000
                    }];
                    db.insert(initialEstablishments);
                    response.sendStatus(201);
                }
                else {
                    console.log('INFO: DB has ' + establishments.length + ' establishments ');
                    response.sendStatus(200);
                }
            });
        }
    });

    // GET a collection
    app.get(BASE_API_PATH + "/establishments", function(request, response) {
        var key = request.query.apikey;
        var offset = Number(request.query.offset);
        var limit = Number(request.query.limit);
        var from = request.query.from;
        var to = request.query.to;
        var mongoquery = {};
        if (from == undefined) {
            from = 0;
        }
        if (to == undefined) {
            to = Number.POSITIVE_INFINITY;
        }
        if (offset == undefined) {
            offset = 0;
        }
        mongoquery.$and = [{
            "year": {
                "$gte": Number(from)
            }
        }, {
            "year": {
                "$lte": Number(to)
            }
        }];
        if (checkApikey(key, response)) {
            console.log("INFO: New GET request to /establishments");
            db.find(
                mongoquery
            ).limit(limit).skip(offset).toArray(function(err, establishments) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var establishmentsSend = establishments;
                    console.log("INFO: Sending establishments: " + JSON.stringify(establishmentsSend, 2, null));
                    response.send(establishmentsSend);
                }
            });
        }
    });


    // GET a single resource with two params
    app.get(BASE_API_PATH + "/establishments/:country/:year", function(request, response) {
        var key = request.query.apikey;
        if (checkApikey(key, response)) {
            var offset = Number(request.query.offset);
            var limit = Number(request.query.limit);
            var from = request.query.from;
            var to = request.query.to;
            var country = request.params.country;
            var year = Number(request.params.year);
            if (from == undefined) {
                from = 0;
            }
            if (to == undefined) {
                to = Number.POSITIVE_INFINITY;
            }
            if (offset == undefined) {
                offset = 0;
            }
            if (!country || !year) {
                console.log("WARNING: New GET request to /establishments/ without country or year, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New GET request to /establishments/" + country + "/" + year);
                db.find({
                    "country": country,
                    "year": year
                }).limit(limit).skip(offset).toArray(function(err, filteredEstablishments) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        if (filteredEstablishments.length > 0) {
                            var establishmentsSend = filteredEstablishments;
                            console.log("INFO: Sending establishments: " + JSON.stringify(establishmentsSend, 2, null));
                            response.send(establishmentsSend);
                        }
                        else {
                            console.log("WARNING: There are not establishments");
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });

    //GET a single resource with one param
    app.get(BASE_API_PATH + "/establishments/:parameter", function(request, response) {
        var key = request.query.apikey;
        var offset = request.query.offset;
        var limit = Number(request.query.limit);
        var from = Number(request.query.from);
        var to = request.query.to;
        var parameter = request.params.parameter;
        var country;
        var year;
        var mongoquery = {};
        if (from == undefined) {
            from = 0;
        }
        if (to == undefined) {
            to = Number.POSITIVE_INFINITY;
        }
        if (offset == undefined) {
            offset = 0;
        }
        if (parameter == undefined) {
            console.log("WARNING: New GET request to /establishments/ without country or year, sending 400...");
            response.sendStatus(400); // bad request
        }
        if (isNaN(parameter)) {
            mongoquery = {
                "country": parameter
            };
            country = parameter;
        }
        else {
            mongoquery = {
                "year": Number(parameter)
            };
            year = Number(parameter);
        }

        mongoquery.$and = [{
            "year": {
                "$gte": Number(from)
            }
        }, {
            "year": {
                "$lte": Number(to)
            }
        }];
        if (checkApikey(key, response)) {
            console.log("INFO: New GET request to /establishments/" + country + year);
            db.find(
                mongoquery
            ).limit(limit).skip(offset).toArray(function(err, filteredEstablishments) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    if (filteredEstablishments.length > 0) {
                        var establishmentsSend = filteredEstablishments;
                        console.log("INFO: Sending establishments: " + JSON.stringify(establishmentsSend, 2, null));
                        response.send(establishmentsSend);
                    }
                    else {
                        console.log("WARNING: There are not establishments");
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    });

    //POST over a collection
    app.post(BASE_API_PATH + "/establishments", function(request, response) {
        var key = request.query.apikey;
        if (checkApikey(key, response)) {
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
                    db.find({
                        "country": newEstablishment.country,
                        "year": newEstablishment.year
                    }).toArray(function(err, establishmentsBeforeInsertion) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
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
        }
    });

    //POST over a single resource
    app.post(BASE_API_PATH + "/establishments/:country/:year", function(request, response) {
        var key = request.query.apikey;
        if (checkApikey(key, response)) {
            var country = request.params.country;
            var year = request.params.year;
            console.log("WARNING: New POST request to /establishments/" + country + "/" + year + ", sending 405...");
            response.sendStatus(405); // method not allowed
        }
    });

    //PUT over a collection
    app.put(BASE_API_PATH + "/establishments", function(request, response) {
        var key = request.query.apikey;
        if (checkApikey(key, response)) {
            console.log("WARNING: New PUT request to /establishments, sending 405...");
            response.sendStatus(405); // method not allowed
        }
    });



    //PUT over a single resource
    app.put(BASE_API_PATH + "/establishments/:country/:year", function(request, response) {
        var key = request.query.apikey;
        if (checkApikey(key, response)) {
            var updatedEstablishment = request.body;
            var country = request.params.country;
            var year = Number(request.params.year);
            if (!updatedEstablishment) {
                console.log("WARNING: New PUT request to /establishments/ without content, sending 400...");
                response.sendStatus(400); // bad request
            }
            else if (country !== updatedEstablishment.country) {
                response.sendStatus(400);
            }
            else if (year !== updatedEstablishment.year) {
                response.sendStatus(400);
            }
            else {
                console.log("INFO: New PUT request to /establishments/" + country + "/" + year + " with data " + JSON.stringify(updatedEstablishment, 2, null));
                if (!updatedEstablishment.country || !updatedEstablishment.year || !updatedEstablishment.number || !updatedEstablishment.beds || !updatedEstablishment.nights) {
                    console.log("WARNING: The establishment " + JSON.stringify(updatedEstablishment, 2, null) + " is not well-formed, sending 422...");
                    response.sendStatus(422); // unprocessable entity
                }
                else {
                    db.find({
                        "country": country,
                        "year": year
                    }).toArray(function(err, establishmentsBeforeInsertion) {
                        if (err) {
                            console.error('WARNING: Error getting data from DB');
                            response.sendStatus(500); // internal server error
                        }
                        else {
                            if (establishmentsBeforeInsertion.length > 0) {
                                db.update({
                                    "country": country,
                                    "year": year
                                }, updatedEstablishment);
                                console.log("INFO: Modifying establishment with country " + country + " with data " + JSON.stringify(updatedEstablishment, 2, null));
                                response.send(updatedEstablishment); // return the updated establishment
                            }
                            else {
                                console.log("WARNING: There are not any establishment with country " + updatedEstablishment.country);
                                response.sendStatus(404); // not found
                            }
                        }
                    });
                }
            }
        }
    });

    //DELETE over a collection
    app.delete(BASE_API_PATH + "/establishments", function(request, response) {
        var key = request.query.apikey;
        if (checkApikey(key, response)) {
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
        }
    });


    //DELETE over a single resource
    app.delete(BASE_API_PATH + "/establishments/:country/:year", function(request, response) {
        var key = request.query.apikey;
        if (checkApikey(key, response)) {
            var country = request.params.country;
            var year = Number(request.params.year);
            if (!country || !year) {
                console.log("WARNING: New DELETE request to /establishments/:country/:year without country or year, sending 400...");
                response.sendStatus(400); // bad request
            }
            else {
                console.log("INFO: New DELETE request to /establishments/" + country + "/" + year);
                db.remove({
                    "country": country,
                    "year": year
                }, true, function(err, result) {
                    if (err) {
                        console.error('WARNING: Error removing data from DB');
                        response.sendStatus(500); // internal server error
                    }
                    else {
                        result = JSON.parse(result);
                        console.log("INFO: Establishments removed: " + result.n);
                        if (result.n === 1) {
                            console.log("INFO: The establishment with country " + country +
                                " from year " + year + " has been succesfully deleted, sending 204...");
                            response.sendStatus(204); // no content
                        }
                        else {
                            console.log("WARNING: There are no establishments to delete");
                            response.sendStatus(404); // not found
                        }
                    }
                });
            }
        }
    });

};
