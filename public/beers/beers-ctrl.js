angular
    .module("SOS161710")
    .controller("BeersCtrl", ["$scope", "$http", "$rootScope", function($scope, $http, $rootScope) { //inyeccion de dependencia
        var url = "http://sos1617-10.herokuapp.com/api/v2";
        var apikey = "";
        var yearfrom = "";
        var yearto = "";
        var offset = "";
        var size = 5;
        var limit = "&limit=" + size;
        if ($rootScope.data) {
                $scope.apikeyfield=$rootScope.data.apikey;
                apikey = $rootScope.data.apikey;
                refresh();
            }

        console.log("Controller initialized right");

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
            
            var urlrequest = url + "/beers-stats?" + apikey + yearfrom + yearto + limit + offset;
            console.log(urlrequest);
            $http.get(url + "/beers-stats?" + apikey + yearfrom + yearto).then(function(response) {
                $scope.pages = range(1, Math.ceil(response.data.length / size));
            });
            $http
                .get(urlrequest)
                .then(function(response) {

                    $scope.beers = response.data;
                    document.getElementById("buttonLoad").className = "btn btn-info";
                    document.getElementById("buttonAddModal").className = "btn btn-primary";
                    document.getElementById("buttonDeleteAll").className = "btn btn-danger";
                    document.getElementById("buttonFilter").className = "btn btn-info";
                    document.getElementById("buttonClear").className = "btn btn-success";
                }, function(response) {
                    if (response.data == "Forbidden") {
                        $scope.beers = [];
                        bootbox.alert("Incorrect apikey.");

                    }
                    if (response.data == "Unauthorized") {
                        $scope.beers = [];
                        bootbox.alert("You have to introduce an apikey");

                    }
                    document.getElementById("buttonLoad").className = "btn btn-info disabled";
                    document.getElementById("buttonAddModal").className = "btn btn-primary disabled";
                    document.getElementById("buttonDeleteAll").className = "btn btn-danger disabled";
                    document.getElementById("buttonFilter").className = "btn btn-info disabled";
                    document.getElementById("buttonClear").className = "btn btn-success disabled";
                });
        }
        $scope.addBeer = function() {
            if ($scope.newBeer == undefined) {
                $scope.newBeer = {};
            }
            if ($scope.newBeer.birthyear != undefined) {
                $scope.newBeer.birthyear = Number($scope.newBeer.birthyear);
            }
            $http
                .post(url + "/beers-stats?" + apikey, $scope.newBeer)
                .then(function(response) {

                    bootbox.alert("Beer Created");
                    refresh();
                    $scope.newBeer = {};
                }, function(response) {
                    switch (response.status) {
                        case 409:
                            bootbox.alert("The Beer that you are trying to add, exits.");
                            break;
                        case 400:
                            bootbox.alert("The Beer that you are trying to add, Have bad data. Please insert all the fields");
                            break;
                        default:
                            bootbox.alert("Please make sure that you have entered all the fields");
                            break;
                    }

                });

        };
        $scope.deleteBeer = function(country, birthyear) {
            bootbox.confirm({
                title: "Delete Beer?",
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
                            .delete(url + "/beers-stats/" + country + "/" + birthyear + "?" + apikey).then(function(response) {
                                    bootbox.alert("Beer remove");
                                    console.log("Beer deleted");
                                    refresh();
                                }

                            );
                    }
                }
            });

        };
        $scope.updateBeer = function(country, birthyear) {
            $scope.Beer.birthyear = Number($scope.Beer.birthyear);
            $http.put(url + "/beers-stats/" + country + "/" + Number(birthyear) + "?" + apikey, $scope.Beer).then(function(response) {
                $scope.responsedata = response.data;
                bootbox.alert("Beer Updated");
                refresh();

            }, function(response) {
                switch (response.status) {
                    case 400:
                        bootbox.alert("The Beer that you are trying to add, Have bad data. Please insert all the fields");
                        break;
                    default:
                        bootbox.alert("Please make sure that you have entered all the fields");
                        break;


                }
                $scope.responsedata = response.data;
            });
        };
        $scope.deleteBeers = function() {
            bootbox.confirm({
                title: "Are you Sure?",
                message: "Do you want to delete ALL Beers? This cannot be undone.",
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
                            .delete(url + "/beers-stats/?" + apikey).then(function(response) {
                                    bootbox.alert("Beers deleted");
                                    console.log("Beers deleted");
                                    refresh();
                                    console.log($scope.beers.length);
                                    if($scope.beers.length==0 && $scope.currentPage>1){
                                        $scope.setPage($scope.currentPage-1);
                                        
                                    }
                                }

                            );
                    }
                }
            });

        };
        $scope.fillfields = function(country, birthyear) {
            $scope.Beer = $http
                .get(url + "/beers-stats/" + country + "/" + birthyear + "?" + apikey)
                .then(function(response) {
                    $scope.Beer = response.data;
                    delete $scope.Beer["_id"];
                });
        };
        $scope.sendapi = function() {
            if ($scope.apikeyfield == undefined) {
                apikey = "";
            }
            else {
                apikey = "apikey=" + $scope.apikeyfield;
                $rootScope.data = {
                    apikey: apikey

                };
                console.log($rootScope.data.apikey);

            }
            refresh();
        };
        $scope.filter = function(YearFrom, YearTo, Limit, Offset) {
            if (YearFrom) {
                yearfrom = "&from=" + Number(YearFrom);
            }
            else {
                yearfrom = "";
            }
            if (YearTo) {
                yearto = "&to=" + Number(YearTo);
            }
            else {
                yearto = "";
            }
            $scope.currentPage = 1;
            offset = "";
            /*
            if (Limit) {
                 limit = "&limit=" + Number(Limit);
             }
             else {
                 limit = "";
             }
             if (Offset) {
                 offset = "&offset=" + Number(Offset);
             }
             else {
                 offset = "";
             }
             */
            refresh();

        };
        $scope.clearSearch = function() {
            yearfrom = "";
            yearto = "";
            offset = "";
            $scope.YearFrom = null;
            $scope.YearTo = null;
            $scope.Limit = null;
            $scope.Offset = null;
            $scope.currentPage = 1;
            refresh();
        };
        $scope.clearResponseData = function() {
            $scope.responsedata = "";
        };
        $scope.load = function() {
            $http.get(url + "/beers-stats/loadInitialData?" + apikey).then(function(response) {
                bootbox.alert("Loaded");
                refresh();
            });
        };
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
