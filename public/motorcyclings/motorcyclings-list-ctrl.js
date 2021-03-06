angular
.module("SOS161710")
.controller("MotorcyclingsCtrl",["$scope","$http","$rootScope",function($scope,$http,$rootScope){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2";
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
    
    $scope.currentPage = 1;
    $scope.pages = [];

    function range(start, end) {
        var res = [];
        for (var i = start; i <= end; i++) {
            res.push(i);
        }
        return res;
    }
    
    function refresh(){
         $http
            .get(url + "/motorcycling-stats/?" + apikey)
            .then(function(response){
                 $scope.pages = range(1, Math.ceil(response.data.length / size));
                 console.log("Datos totales:"+response.data.length);
                console.log("Datos por pagina:"+size);
            });
        $http
            .get(url + "/motorcycling-stats/?" + apikey + yearfrom + yearto + limit + offset)
            .then(function(response){
                $scope.motorcyclings = response.data;
                console.log("Muestra datos:"+JSON.stringify(response.data));
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
        if ($scope.newMotorcycling) {
                $scope.newMotorcycling.year = Number($scope.newMotorcycling.year);
        }
        
        $http
            .post(url + "/motorcycling-stats?"  + apikey, $scope.newMotorcycling)
            .then(function(response){
                console.log("Motorcycling added");
                bootbox.alert("Motorcycling added");
                refresh();
            }, function(response) {
                    switch (response.status) {
                        case 400:
                            bootbox.alert("Please make sure you enter all fields");
                            break;
                        case 409:
                            bootbox.alert("Motorcycling added already exists.");
                            break;
                        case 422:
                            bootbox.alert("Please make sure you enter all fields");
                            break;
                        default:
                            // code
                    }
                
        });
    
    };
    
    $scope.deleteMotorcycling = function(country, year) {
        $http
            .delete(url + "/motorcycling-stats/" + country + "/" + year + "?"  + apikey)
            .then(function(response) {
                console.log("Motorcycling deleted");
                bootbox.alert("Motorcycling deleted.");
                refresh();
             });
    };

    $scope.deleteAllMotorcyclings = function() {
        $http
            .delete(url + "/motorcycling-stats?"  + apikey)
            .then(function(response) {
                console.log("All motorcyclings deleted");
                bootbox.alert("All motorcyclings deleted.");
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
                            bootbox.alert("Please make sure you enter all fields");
                            break;
                        case 422:
                            bootbox.alert("Please make sure you enter all fields");
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
            $scope.currentPage = 1;
            refresh();

        };
    
    $scope.setPage = function(pageNumber) {
        $scope.currentPage = pageNumber;

        if (pageNumber == 1) {
            $("#previousPage").addClass("disabled");
        }else{ 
            $("#previousPage").removeClass("disabled");
        }
        
        if (pageNumber == $scope.pages.length) {
            $("#nextPage").addClass("disabled");
        }else{
            $("#nextPage").removeClass("disabled");
            $(".active").removeClass("active");
            $("#Page" + $scope.currentPage).addClass("active");
        }
        offset = "&offset=" + (($scope.currentPage * size) - size);

        refresh(); 
    }; 

  /*$scope.firstPage = function() {
        return $scope.currentPage == 1;
    }
    $scope.lastPage = function() {
        return $scope.currentPage == $scope.lastPageNum;
    }
    $scope.numberOfPages = function(){
        return $scope.pages.length * size;
    }
    $scope.pageBack = function() {
        $scope.currentPage - 1;
    }
    $scope.pageForward = function() {
        $scope.currentPage + 1;
    }
  */  
  
  
}]);    