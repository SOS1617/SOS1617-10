angular.module("BeersManagerApp",["ngRoute"]).config(function ($routeProvider){
    $routeProvider.when("/",{
        templateUrl : "/beers/BeersList.html",
        controller : "/beers/beers-ctrl.js"
        
    });
});
            console.log("App initialized");