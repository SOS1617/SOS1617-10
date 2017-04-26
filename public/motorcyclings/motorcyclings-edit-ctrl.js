angular
.module("MotorcyclingsManagerApp")
.controller("MotorcyclingsEditCtrl",["$scope","$http","$routeParams","$location",function($scope,$http,$routeParams,$location){
    console.log("Edit controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v1";
    var apikey = "";
    
    function refresh(){
        var year = Number($routeParams.year);
        $http
            .get(url + "/motorcycling-stats/?" + $routeParams.country + "/" + $routeParams.year + "?" + apikey)
            .then(function(response){
                $scope.motorcyclings = response.data;
                delete $scope.updatedMotorcycling["_id"];
            });
    }
    
    $scope.updateMotorcycling = function(){
        var year = Number($routeParams.year);
        $http
            .put(url +"/motorcycling-stats/"+ $routeParams.country + "/" + year + "?" + apikey, $scope.updatedMotorcycling)
            .then(function(response){
                console.log("Motorcycling Updated");
                bootbox.alert("Motorcycling Updated");
                $location.path("/");
            }, function(response) {
                    switch (response.status) {
                        case 400:
                            bootbox.alert("Bad Request. Please enter all fields correctly.");
                            break;
                        default:
                            bootbox.alert("Please make sure that you have entered all the fields");
                            break;
                    }
            });
    };
    
    refresh();
    
}]);