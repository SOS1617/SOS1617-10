angular
.module("MotorcyclingsManagerApp")
.controller("ListCtrl",["$scope","$http",function($scope,$http){
    console.log("Controller initialized (splited right)");
    var url = "http://sos1617-10.herokuapp.com/api/v1";
    
    function refresh(){
        $http
            .get(url + "/motorcycling-stats/?apikey=davbotcab")
            .then(function(response){
                $scope.motorcyclings = response.data;
            });
    }

    
    $scope.loadInitialData = function() {
        $http
            .get(url + "/motorcycling-stats/loadInitialData?apikey=davbotcab")
            .then(function(response) {
                console.log("Carga inicial");
                refresh();
            });
    };
        
    $scope.addMotorcycling = function(){
        $http
            .post(url + "/motorcycling-stats?apikey=davbotcab", $scope.newMotorcycling)
            .then(function(response){
                console.log("Motorcycling added");
                refresh();
        });
    
    };
    
    $scope.deleteMotorcycling = function(country, year) {
        $http
            .delete(url + "/motorcycling-stats/" + country + "/" + year + "?apikey=davbotcab")
            .then(function(response) {
                console.log("Motorcycling deleted");
                refresh();
             });
    };

    $scope.deleteAllMotorcyclings = function() {
        $http
            .delete(url + "/motorcycling-stats?apikey=davbotcab")
            .then(function(response) {
                console.log("All motorcyclings deleted");
                refresh();
            });
    };
    
    $scope.putMotorcycling = function(data) {
        $http
            .put(url + "/motorcycling-stats/" + data.country + "/" + data.year + "?apikey=davbotcab", {
                country:data.country,
                year:data.year,
                pilot:data.pilot,
                team:data.team
            })
            .then(function(response) {
                console.log("Motorcycling updated");
                refresh();
            });
    };
    
 refresh();
}]);