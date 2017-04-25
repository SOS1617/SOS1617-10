angular
    .module("SOS161710")
    .controller("EstablishmentsEditCtrl", ["$scope", "$http", "$routeParams", "$location",function($scope, $http, $routeParams, $location) { //inyección de dependencia
        console.log("Edit controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v2";
        var apikey = "apikey=nurtrioje";

        function refresh() {
            var year = Number($routeParams.year);
            $http
                .get(url + "/establishments/" + $routeParams.country + "/" + year + "?" + apikey)
                .then(function(response) { //promesas
                    console.log(url + "/establishments/" + $routeParams.country + "/" + year + "?" + apikey);
                    $scope.updatedEstablishment = response.data[0];
                    console.log(response.data);
                    delete $scope.updatedEstablishment["_id"];
                }, function(err){
                    console.log(err.data);
                });
        }
        
        $scope.updateEstablishment = function() {
            var year = Number($routeParams.year);
            $http
                .put(url + "/establishments/" + $routeParams.country + "/" + year + "?" + apikey, $scope.updatedEstablishment)
                .then(function(response){
                    console.log("Establishment updated");
                    bootbox.alert("Establishment updated.");
                    $location.path("/establishments/");
                }, function(response) {
                    switch (response.status) {
                        case 400:
                            bootbox.alert("Bad Request. Please make sure you have introduced correctly all fields.");
                            break;
                        case 422:
                            bootbox.alert("Please make sure you have introduced all fields.");
                            break;
                        default:
                            // code
                    }
                });
        };
        
        refresh();
        
    }]);
