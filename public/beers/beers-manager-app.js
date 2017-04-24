angular.module("BeersManagerApp",["ngRoute"]).config(function ($routeProvider){
    $routeProvider.when("/",{
        templateUrl : "BeersList.html",
        controller : "BeersCtrl"
        
    });
});
            console.log("App initialized");