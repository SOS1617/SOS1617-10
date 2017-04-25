angular
.module("MotorcyclingsManagerApp")
.controller("MotorcyclingsCtrl",["$scope","$http","$routeParams","$location",function($scope,$http,$routeParams,$location){
    console.log("Edit controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v1";
    var apikey = "";
    
    function refresh(){
        var year = Number($routeParams.year);
        $http
            .get(url + "/motorcycling-stats/?" + $routeParams.country + "/" + year + "?" + apikey)
            .then(function(response){
                $scope.motorcyclings = response.data;
            });
    }
    
    $scope.updateMotorcycling = function(){
        var year = Number($routeParams.year);
        $http
            .put(url +"/motorcycling-stats/"+ $routeParams.country + "/" + year + "?" + apikey, $scope.updatedMotorcycling)
            .then(function(response){
                console.log("Motorcycling Updated");
                $location.path("/");
            });
    };
    
    refresh();
    
}]);