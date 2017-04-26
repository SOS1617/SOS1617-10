angular
.module("SOS161710")
.controller("MotorcyclingsCtrl",["$scope","$http","$rootScope",function($scope,$http,$rootScope){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v1";
    var apikey = "";
    var yearfrom = "";
    var yearto = "";
    var size = 5;
    var limit = "";
    var offset = "";
    
    $scope.currentPage = 1;
    $scope.pages = [];
    
    if ($rootScope.data) {
            $scope.apikeyField = $rootScope.data.simpleApikey;
            apikey = $rootScope.data.apikey;
            refresh();
    }
    
    function range(start, end) {
        var res = [];
        for (var i = start; i <= end; i++) {
            res.push(i);
        }
        return res;
    }
    
    function refresh(){
        $http
            .get(url + "/motorcycling-stats/?" + apikey + yearfrom + yearto + limit + offset)
            .then(function(response){
                console.log(response.data.length);
                console.log(Math.ceil(response.data.length / size));
                $scope.pages = range(1, Math.ceil(response.data.length / size));
            
                console.log($scope.pages);
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
        $scope.newMotorcycling.year=Number($scope.newMotorcycling.year);
        $http
            .put(url +"/motorcycling-stats/"+ $scope.newMotorcycling.country + "/" +  $scope.newMotorcycling.year + "?"  + apikey, $scope.newMotorcycling )
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
        
    
        $scope.setPage = function(page) {
            $scope.currentPage = page;

            if (page == 1) $("#previousPage").addClass("disabled");
            else $("#previousPage").removeClass("disabled");

            if (page == $scope.pages.length) $("#nextPage").addClass("disabled");
            else $("#nextPage").removeClass("disabled");

            $(".active").removeClass("active");
            $("#Page" + $scope.currentPage).addClass("active");

            offset = "&offset=" + (($scope.currentPage * size) - size);

            refresh();
        };
    
}]);