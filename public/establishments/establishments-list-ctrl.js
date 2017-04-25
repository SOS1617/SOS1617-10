angular
    .module("EstablishmentsManagerApp")
    .controller("EstablishmentsCtrl", ["$scope", "$http", function($scope, $http) { //inyección de dependencia
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v1";
        var apikey = "";
        var from = "";
        var to = "";
        var size = 5;
        var limit = "&limit=" + size;
        var offset = "";

        $scope.currentPage = 1;
        $scope.pages = [];

        function range(start, end) {
            var res = [];
            for (var i = start; i <= end; i++) {
                res.push(i);
            }
            return res;
        }

        function refresh() {
            $http
                .get(url + "/establishments?" + apikey + from + to)
                .then(function(response) {
                    console.log(response.data.length);
                    console.log(Math.ceil(response.data.length / size));
                    $scope.pages = range(1, Math.ceil(response.data.length / size));

                    console.log($scope.pages);
                });
            $http
                .get(url + "/establishments?" + apikey + from + to + limit + offset)
                .then(function(response) { //promesas
                    $scope.establishments = response.data;
                }, function(err) {
                    if (err.data == "Forbidden") {
                        $scope.establishments = [];
                        bootbox.alert("Incorrect apikey.");

                    }
                    if (err.data == "Unauthorized") {
                        $scope.establishments = [];
                        bootbox.alert("You have to introduce an apikey");

                    }
                    document.getElementById("Search").className = "btn btn-info disabled";
                    document.getElementById("Load").className = "btn btn-success btn-lg disabled";
                    document.getElementById("Add").className = "btn btn-primary disabled";
                    document.getElementById("Delete").className = "btn btn-danger disabled";
                });
        }

        $scope.loadData = function() {
            $http
                .get(url + "/establishments/loadInitialData?" + apikey)
                .then(function(response) {
                    console.log(response.data);
                    refresh();
                });
        };

        $scope.addEstablishment = function() {
            if ($scope.newEstablishment) {
                $scope.newEstablishment.year = Number($scope.newEstablishment.year);
                $scope.newEstablishment.number = Number($scope.newEstablishment.number);
                $scope.newEstablishment.beds = Number($scope.newEstablishment.beds);
                $scope.newEstablishment.nights = Number($scope.newEstablishment.nights);
            }

            $http
                .post(url + "/establishments?" + apikey, $scope.newEstablishment)
                .then(function(response) {
                    console.log("Establishment added");
                    bootbox.alert("Establishment added.");
                    $scope.newEstablishment = {};
                    refresh();
                }, function(response) {
                    switch (response.status) {
                        case 400:
                            bootbox.alert("Bad Request. Please make sure you have introduced correctly all fields.");
                            break;
                        case 409:
                            bootbox.alert("Conflict. The establishment added already exists.");
                            break;
                        case 422:
                            bootbox.alert("Please make sure you have introduced all fields.");
                            break;
                        default:
                            // code
                    }
                });
        };

        $scope.deleteEstablishment = function(country, year) {
            bootbox.confirm({
                title: "Delete Establishment?",
                message: "Are you Sure? This cannot be undone.",
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: function(result) {
                    if (result == true) {
                        $http
                            .delete(url + "/establishments/" + country + "/" + year + "?" + apikey)
                            .then(function(response) {
                                console.log("Establishment deleted");
                                bootbox.alert("Establishment deleted.");
                                refresh();
                            });
                    }
                }
            });

        };

        $scope.deleteAllEstablishments = function() {
            bootbox.confirm({
                title: "Are you Sure?",
                message: "Do you want to delete ALL Establishments? This cannot be undone.",
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> Cancel'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> Confirm'
                    }
                },
                callback: function(result) {
                    if (result == true) {
                        $http
                            .delete(url + "/establishments?" + apikey)
                            .then(function(response) {
                                console.log("All establishments deleted");
                                bootbox.alert("All establishments deleted.");
                                refresh();
                            });
                    }
                }
            });

        };

        $scope.putEstablishment = function(country, year) {
            $http
                .put(url + "/establishments/" + country + "/" + Number(year) + "?" + apikey, $scope.Establishment)
                .then(function(response) {
                    $scope.responseData = response.data;
                    console.log("Establishment updated");
                    bootbox.alert("Establishment updated.");
                    refresh();
                }, function(response) {
                    switch (response.status) {
                        case 400:
                            bootbox.alert("Bad Request. Please make sure you have introduced correctly all fields.");
                            break;
                        case 422:
                            bootbox.alert("Please make sure you have introduced all fields.");
                            break;
                        case 404:
                            bootbox.alert("Establishment not found. Please make sure your have introduced correctly the country or the year.");
                            break;
                        default:
                            // code
                    }
                });
        };

        $scope.fillFields = function(country, year) {
            $scope.Establishment = $http
                .get(url + "/establishments/" + country + "/" + year + "?" + apikey)
                .then(function(response) {
                    $scope.Establishment = response.data[0];
                    delete $scope.Establishment["_id"];
                    console.log($scope.Establishment);
                })[0];
        };

        $scope.clearResponseData = function() {
            $scope.responseData = "";
        };

        $scope.setApikey = function() {
            if ($scope.Apikey == undefined) apikey = "";
            else apikey = "apikey=" + $scope.Apikey;
            document.getElementById("Search").className = "btn btn-info";
            document.getElementById("Load").className = "btn btn-success btn-lg";
            document.getElementById("Add").className = "btn btn-primary";
            document.getElementById("Delete").className = "btn btn-danger";
            refresh();
        };

        $scope.search = function(fromYear, toYear) {
            if (fromYear) from = "&from=" + Number(fromYear);
            else from = "";
            if (toYear) to = "&to=" + Number(toYear);
            else to = "";

            offset = "";
            $scope.currentPage = 1;
            $scope.establishments = [];
            refresh();
        };

        //        $scope.paginate = function(Limit, Offset) {
        //            if (Limit) limit = "&limit=" + Number(Limit);
        //            else limit = "";
        //            if (Offset) offset = "&offset=" + Number(Offset);
        //            else offset = "";
        //
        //            refresh();
        //        };

        $scope.setPage = function(page) {
            $scope.currentPage = page;

            if (page == 1) $("#previousPage").addClass("disabled");
            else $("#previousPage").removeClass("disabled");

            if (page == $scope.pages.length) $("#nextPage").addClass("disabled");
            else $("#nextPage").removeClass("disabled");

            $(".active").removeClass("active");
            $("#Page" + $scope.currentPage).addClass("active");

            offset = "&offset=" + (($scope.currentPage * size) - size);

            refresh();
        };

    }]);
