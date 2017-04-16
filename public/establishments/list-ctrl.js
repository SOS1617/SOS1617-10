angular
    .module("EstablishmentsManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) { //inyección de dependencia
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v1";
        var apikey = "";
        var from = "";
        var to = "";
        var limit = "";
        var offset = "";

        function refresh() {
            $http
                .get(url + "/establishments?" + apikey + from + to + limit + offset)
                .then(function(response) { //promesas
                    $scope.establishments = response.data;
                }, function(err) {
                    if (err.data == "Unauthorized" || err.data == "Forbidden") {
                        $scope.establishments = [];
                        document.getElementById("Search").className = "btn btn-info disabled";
                        document.getElementById("Paginate").className = "btn btn-default disabled";
                        document.getElementById("Load").className = "btn btn-success btn-lg disabled";
                        document.getElementById("Add").className = "btn btn-primary disabled";
                        document.getElementById("Delete").className = "btn btn-danger disabled";
                        bootbox.alert("Incorrect apikey. Check apikey");
                    }
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
            $scope.newEstablishment.year = Number($scope.newEstablishment.year);
            $scope.newEstablishment.number = Number($scope.newEstablishment.number);
            $scope.newEstablishment.beds = Number($scope.newEstablishment.beds);
            $scope.newEstablishment.nights = Number($scope.newEstablishment.nights);
            $http
                .post(url + "/establishments?" + apikey, $scope.newEstablishment)
                .then(function(response) {
                    console.log("Establishment added");
                    refresh();
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
                    refresh();
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
            apikey = "apikey=" + $scope.Apikey;
            document.getElementById("Search").className = "btn btn-info";
            document.getElementById("Paginate").className = "btn btn-default";
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
            refresh();
        };

        $scope.paginate = function(Limit, Offset) {
            if (Limit) limit = "&limit=" + Number(Limit);
            else limit = "";
            if (Offset) offset = "&offset=" + Number(Offset);
            else offset = "";
            refresh();
        };

    }]);
