angular
.module("SOS161710")
.controller("MotorcyclingsCtrl",["$scope","$http","$rootScope",function($scope,$http,$rootScope){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v1";
    var apikey = "";
    var yearfrom = "";
    var yearto = "";
    var limit = "";
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
                $scope.motorcyclings = response.data;
            }, function(err) {
                    if (err.data == "Forbidden") {
                        $scope.establishments = [];
                        bootbox.alert("Incorrect apikey.");

                    }
                    if (err.data == "Unauthorized") {
                        $scope.establishments = [];
                        bootbox.alert("You have to introduce an apikey");

                }
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
            .put(url +"/motorcycling-stats/"+ country + "/" + Number(year) + "?"  + apikey, $scope.Motorcycling )
            .then(function(response){
                $scope.responseData = response.data;
                console.log("Motorcycling updated");
                bootbox.alert("Motorcycling updated.");
                refresh();
            }, function(response) {
                    switch (response.status) {
                        case 400:
                            bootbox.alert("Bad Request. Please enter all fields correctly.");
                            break;
                        case 422:
                            bootbox.alert("Please make sure you have introduced all fields.");
                            break;
                        case 404:
                            bootbox.alert("Motorcycling not found.");
                            break;
                        default:

                    }
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
    
    
    $scope.filter = function(YearFrom, YearTo) {
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
            offset = "";
            refresh();

        };
        
    function PagerService() {
        var service = {};
 
        service.GetPager = GetPager;
 
        return service;
 
    
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;
 
        // default page size is 10
        pageSize = pageSize || 5;
 
        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);
 
        var startPage, endPage;
        if (totalPages <= 5) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
 
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
 
        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);
 
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
}]);