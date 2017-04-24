angular
    .module("BeersManagerApp")
    .controller("EditBeersCtrl", ["$scope", "$http","$routeParams","$location", 
    function($scope, $http,$routeParams,$location) { //inyeccion de dependencia
        
        console.log("Edit Controller initialized");
        
        refresh();
        function refresh(){
        $http
            .get("/api/v1/beers-stats/"+$routeParams.country+"/"+$routeParams.birthyear+'?apikey=sos1617-jesusguerre')
            .then(function(response) {
                $scope.Beer = response.data;
                delete $scope.Beer["_id"];
            });
        }
        $scope.updateBeer = function (country,birthyear) {
            var url = "/api/v1/beers-stats/"+ country + "/" + Number(birthyear)+ '?apikey=sos1617-jesusguerre';
             
          $http.put(url,$scope.Beer).then( function (response){
             console.log(url);
             console.log(response.data);
             $location.path("/");
          },function (response){
              console.log(response.data);
          });  
        };
       
        
        
    }]);
