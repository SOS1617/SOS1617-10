angular
    .module("BeersManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) { //inyeccion de dependencia
        console.log("Controller initialized right");
        refresh();
        function refresh(){
        $http
            .get("/api/v1/beers-stats")
            .then(function(response) {
                $scope.beers = response.data;
            });
        }
        $scope.addBeer = function() {
            $http
                .post("/api/v1/beers-stats", $scope.newBeer)
                .then(function(response) {
                    console.log("Beer added");
                    refresh();
                });
            
        };
        $scope.deleteBeer = function(country,birthyear){
            $http
                .delete("/api/v1/beers-stats/"+country+"/"+birthyear).then(function (response){
                    console.log("Beer deleted");
                    refresh();
                }
                    
                    );
        }
        
        
    }]);
