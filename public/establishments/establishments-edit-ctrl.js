angular
    .module("EstablishmentsManagerApp")
    .controller("EstablishmentsEditCtrl", ["$scope", "$http", "$routeParams", "$location",function($scope, $http, $routeParams, $location) { //inyección de dependencia
        console.log("Edit controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v1";
        var apikey = "apikey=nurtrioje";

        function refresh() {
            $http
                .get(url + "/establishments/" + $routeParams.country + "/" + $routeParams.year + "?" + apikey)
                .then(function(response) { //promesas
                    $scope.newEstablishment = response.data;
                });
        }
        
        $scope.updateEstablishment = function() {
            var year = Number($routeParams.year);
            $http
                .put(url + "/establishments/" + $routeParams.country + "/" + year + "?" + apikey, $scope.newEstablishment)
                .then(function(response){
                    console.log("Establishment updated");
                    $location.path("/");
                });
        };
        
        refresh();
        
    }]);
