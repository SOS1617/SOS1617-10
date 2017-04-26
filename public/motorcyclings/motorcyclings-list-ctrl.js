angular
.module("SOS161710")
.controller("MotorcyclingsCtrl",["$scope","$http","$rootScope",function($scope,$http,$rootScope){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v1";
    var apikey = "";
    var yearfrom = "";
    var yearto = "";
    var size = 5;
    var limit = "&limit=" + size;
    var offset = "";

    
    if ($rootScope.data) {
            $scope.apikeyField = $rootScope.data.simpleApikey;
            apikey = $rootScope.data.apikey;
            refresh();
    }
    
    
    function refresh(){
        $http
            .get(url + "/motorcycling-stats/?" + apikey + yearfrom + yearto + limit + offset)
            .then(function(response){

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
    
    
    $scope.putMotorcycling = function(country, year){
        $http
            .put(url +"/motorcycling-stats/"+ country + "/" +  Number(year) + "?"  + apikey, $scope.newMotorcycling )
            .then(function(response){
                console.log("Motorcycling Updated");
                refresh();
            });
    };
    
    $scope.sendapi = function() {
        if ($scope.apikeyField == undefined) {
            apikey = "";
        }
        else {
            apikey = "apikey=" + $scope.apikeyField;
            $rootScope.data = {
                apikey: apikey,
                simpleApikey: $scope.apikeyField
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