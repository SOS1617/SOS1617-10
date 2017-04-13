angular
    .module("BeersManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) { //inyeccion de dependencia
        var url = "http://sos1617-10.herokuapp.com";
        var apikey="apikey="+$scope.apikey;
        console.log("Controller initialized right");
        refresh();
        function refresh(){
        $http
            .get(url+"/api/v1/beers-stats?"+apikey)
            .then(function(response) {
                $scope.beers = response.data;
            });
        }
        $scope.addBeer = function() {
            $scope.Beer.birthyear=Number($scope.Beer.birthyear);
            $http
                .post(url+"/api/v1/beers-stats?"+apikey, $scope.Beer)
                .then(function(response) {
                    console.log("Beer added"+$scope.Beer.name);
                    refresh();
                });
            
        };
        $scope.deleteBeer = function(country,birthyear){
            $http
                .delete(url+"/api/v1/beers-stats/"+country+"/"+birthyear+"?"+apikey).then(function (response){
                    console.log("Beer deleted");
                    refresh();
                }
                    
                    );
        };
        $scope.updateBeer = function(country,birthyear){
            $scope.Beer.birthyear=Number($scope.Beer.birthyear);
            $http.put(url+"/api/v1/beers-stats/"+country+"/"+Number(birthyear)+"?"+apikey,$scope.Beer).then(function (response){
                console.log("Beer updated", $scope.Beer);
                refresh();
                
            },function (response){
                console.log($scope.Beer);
                console.log(response.data);
            });
        };
         $scope.deleteBeers = function(){
            $http
                .delete(url+"/api/v1/beers-stats/?"+apikey).then(function (response){
                    console.log("Beers deleted");
                    refresh();
                }
                    
                    );
        };
        $scope.fillfields = function(country,birthyear){
            $scope.Beer = $http
            .get(url+"/api/v1/beers-stats/"+country+"/"+birthyear+"?"+apikey)
            .then(function(response) {
                $scope.Beer = response.data;
                delete $scope.Beer["_id"];
            });
        };
        
        
    }]);
