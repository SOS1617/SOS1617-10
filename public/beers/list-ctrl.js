angular
    .module("BeersManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) { //inyeccion de dependencia
        var url = "http://sos1617-10.herokuapp.com";
        console.log("Controller initialized right");
        refresh();
        function refresh(){
        $http
            .get(url+"/api/v1/beers-stats?apikey=sos1617-jesusguerre")
            .then(function(response) {
                $scope.beers = response.data;
            });
        }
        $scope.addBeer = function() {
            $scope.newBeer.birthyear=Number($scope.newBeer.birthyear);
            $http
                .post(url+"/api/v1/beers-stats?apikey=sos1617-jesusguerre", $scope.newBeer)
                .then(function(response) {
                    console.log("Beer added"+$scope.newBeer.name);
                    refresh();
                });
            
        };
        $scope.deleteBeer = function(country,birthyear){
            $http
                .delete(url+"/api/v1/beers-stats/"+country+"/"+birthyear+"?apikey=sos1617-jesusguerre").then(function (response){
                    console.log("Beer deleted");
                    refresh();
                }
                    
                    );
        };
        $scope.updateBeer = function(country,birthyear){
            $http.put(url+"/api/v1/beers-stats/"+country+"/"+birthyear+"?apikey=sos1617-jesusguerre",$scope.newBeer).then(function (response){
                console.log("Beer updated", $scope.newBeer);
                refresh();
                
            },function (response){
                console.log($scope.newBeer);
                console.log(response.data);
            });
        };
         $scope.deleteBeers = function(){
            $http
                .delete(url+"/api/v1/beers-stats/?apikey=sos1617-jesusguerre").then(function (response){
                    console.log("Beers deleted");
                    refresh();
                }
                    
                    );
        };
        $scope.fillfields = function(country,birthyear){
            $scope.newBeer = $http
            .get(url+"/api/v1/beers-stats/"+country+"/"+birthyear+"?apikey=sos1617-jesusguerre")
            .then(function(response) {
                $scope.newBeer = response.data;
            });
        };
        
        
    }]);
