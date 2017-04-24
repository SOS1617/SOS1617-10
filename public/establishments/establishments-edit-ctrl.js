angular
    .module("EstablishmentsManagerApp")
    .controller("EstablishmentsEditCtrl", ["$scope", "$http", "$routeParams", "$location",function($scope, $http, $routeParams, $location) { //inyección de dependencia
        console.log("Edit controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v1";
        var apikey = "apikey=nurtrioje";

        function refresh() {
            var year = Number($routeParams.year);
            $http
                .get(url + "/establishments/" + $routeParams.country + "/" + year + "?" + apikey)
                .then(function(response) { //promesas
                    $scope.updatedEstablishment = response.data;
                    delete $scope.updatedEstablishment["_id"];
                });
        }
        
        $scope.updateEstablishment = function() {
            var year = Number($routeParams.year);
            $http
                .put(url + "/establishments/" + $routeParams.country + "/" + year + "?" + apikey, $scope.updatedEstablishment)
                .then(function(response){
                    console.log("Establishment updated");
                    $location.path("/");
                });
        };
        
        refresh();
        
    }]);
