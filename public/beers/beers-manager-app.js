angular.module("BeersManagerApp",["ngRoute"]).config(function ($routeProvider){
    $routeProvider.when("/",{
        templateUrl : "BeersList.html",
        controller : "beers-ctrl.js"
        
    });
});
            console.log("App initialized");