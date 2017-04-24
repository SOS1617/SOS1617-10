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
            });
        }
        $scope.updateBeer = function (country,birthyear) {
          $http.put("/api/v1/beers-stats/"+ country + "/" + Number(birthyear)+ '?apikey=sos1617-jesusguerre',$scope.Beer).then( function (response){
             $location.path("/");
          },function (response){
              console.log(response.data);
          });  
        };
       
        
        
    }]);
