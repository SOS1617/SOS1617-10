angular
    .module("BeersManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) { //inyeccion de dependencia
        var url = "http://sos1617-10.herokuapp.com/api/v1";
        var apikey = "";
        var yearfrom = "";
        var yearto = "";
        var offset = "";
        var limit = "";
        console.log("Controller initialized right");

        function refresh() {
            var urlrequest = url + "/beers-stats?" + apikey + yearfrom + yearto + limit + offset;
            console.log(urlrequest);
            $http
                .get(urlrequest)
                .then(function(response) {
                    $scope.beers = response.data;
                },function(response) {
                    if (response.data=="Forbidden" || response.data=="Unauthorized"){
                        $scope.beers = [];
                        bootbox.alert("Apikey incorrect. Check apikey")
                    }
                });
        }
        $scope.addBeer = function() {
            $scope.newBeer.birthyear = Number($scope.newBeer.birthyear);
            $http
                .post(url + "/beers-stats?" + apikey, $scope.newBeer)
                .then(function(response) {
                    $scope.responsedata=response.data;
                    refresh();
                },function(response){
                    $scope.responsedata=response.data;
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
                $scope.responsedata=response.data;
                refresh();

            }, function(response) {
                $scope.responsedata=response.data;
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
                                    console.log("Beers deleted");
                                    refresh();
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
            apikey = "apikey=" + $scope.apikeyfield;
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
            refresh();

        };
        $scope.clearSearch = function() {
            yearfrom = "";
            yearto = "";
            offset = "";
            limit = "";
            $scope.YearFrom = null;
            $scope.YearTo = null;
            $scope.Limit = null;
            $scope.Offset = null;
            refresh();
        };
        $scope.clearResponseData = function() {
            $scope.responsedata="";
        };

    }]);
