angular
.module("MotorcyclingsManagerApp")
.controller("ListCtrl",["$scope","$http",function($scope,$http){
    console.log("Controller initialized (splited right)");
    var url = "http://sos1617-10.herokuapp.com/api/v1";
    var apikey = "";
    var from = "";
    var to = "";
    var limit = "";
    var offset = "";
    
    function refresh(){
        $http
            .get(url + "/motorcycling-stats/?" + apikey + from + to + limit + offset)
            .then(function(response){
                $scope.motorcyclings = response.data;
            }, function(err) {
                    if (err.data == "Unauthorized" || err.data == "Forbidden") {
                        $scope.establishments = [];
                        document.getElementById("Load").className = "btn btn-success btn-lg disabled";
                        document.getElementById("Add").className = "btn btn-primary disabled";
                        document.getElementById("Delete").className = "btn btn-danger disabled";
                        bootbox.alert("Incorrect apikey. Check apikey");
                    }
            });
    }

    
    $scope.loadInitialData = function() {
        $http
            .get(url + "/motorcycling-stats/loadInitialData?" + apikey)
            .then(function(response) {
                console.log(response.data);
                refresh();
            });
    };
        
    $scope.addMotorcycling = function(){
        $http
            .post(url + "/motorcycling-stats?" + apikey, $scope.newMotorcycling)
            .then(function(response){
                console.log("Motorcycling added");
                refresh();
        });
    
    };
    
    $scope.deleteMotorcycling = function(country, year) {
        $http
            .delete(url + "/motorcycling-stats/" + country + "/" + year + "?" + apikey)
            .then(function(response) {
                console.log("Motorcycling deleted");
                refresh();
             });
    };

    $scope.deleteAllMotorcyclings = function() {
        $http
            .delete(url + "/motorcycling-stats?" + apikey)
            .then(function(response) {
                console.log("All motorcyclings deleted");
                refresh();
            });
    };
    
    $scope.putMotorcycling = function(country, year) {
        $http
            .put(url + "/motorcycling-stats/" + country + "/" + year + "?" + apikey, $scope.Motorcycling)
            .then(function(response) {
                $scope.responseData = response.data;
                console.log("Motorcycling updated");
                refresh();
            });
    };
    
    $scope.fillFields = function(country, year) {
        $scope.Establishment = $http
            .get(url + "/motorcycling-stats/" + country + "/" + year + "?" + apikey)
            .then(function(response) {
                $scope.Motorcycling = response.data;
                console.log($scope.Motorcycling);
            });
    };
    
    $scope.clearResponseData = function() {
        $scope.responseData = "";
    };

    $scope.setApikey = function() {
        apikey = "apikey=" + $scope.Apikey;
        document.getElementById("Search").className = "btn btn-info";
        document.getElementById("Paginate").className = "btn btn-default";
        document.getElementById("Load").className = "btn btn-success btn-lg";
        document.getElementById("Add").className = "btn btn-primary";
        document.getElementById("Delete").className = "btn btn-danger";
        refresh();
    };

}]);