angular
.module("MotorcyclingsManagerApp")
.controller("ListCtrl",["$scope","$http",function($scope,$http){
    console.log("Controller initialized (splited right)");
    var url = "http://sos1617-10.herokuapp.com/api/v1";
    var apikey = "";
    var yearfrom = "";
    var yearto = "";
    var limit = "";
    var offset = "";
    
    function refresh(){
        $http
            .get(url + "/motorcycling-stats/?" + apikey + yearfrom + yearto + limit + offset)
            .then(function(response){
                $scope.motorcyclings = response.data;
            });
    }

    
    $scope.loadInitialData = function() {
        $http
            .get(url + "/motorcycling-stats/loadInitialData?"  + apikey)
            .then(function(response) {
                console.log("Carga inicial");
                refresh();
            });
    };
        
    $scope.addMotorcycling = function(){
        $http
            .post(url + "/motorcycling-stats?"  + apikey, $scope.newMotorcycling)
            .then(function(response){
                console.log("Motorcycling added");
                refresh();
        });
    
    };
    
    $scope.deleteMotorcycling = function(country, year) {
        $http
            .delete(url + "/motorcycling-stats/" + country + "/" + year + "?"  + apikey)
            .then(function(response) {
                console.log("Motorcycling deleted");
                refresh();
             });
    };

    $scope.deleteAllMotorcyclings = function() {
        $http
            .delete(url + "/motorcycling-stats?"  + apikey)
            .then(function(response) {
                console.log("All motorcyclings deleted");
                refresh();
            });
    };
    
    
    $scope.putMotorcycling = function(){
    $scope.newMotorcycling.year=Number( $scope.newMotorcycling.year);
        $http
            .put(url +"/motorcycling-stats/"+ $scope.newMotorcycling.country + "/" +  $scope.newMotorcycling.year + "?"  + apikey, $scope.newMotorcycling )
            .then(function(response){
                console.log("Motorcycling Updated");
                refresh();
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
}]);