angular.module("BeersManagerApp",["ngRoute"]).config(function ($routeProvider){
    $routeProvider.when("/",{
        templateUrl : "BeersList.html",
        controller : "BeersCtrl"
        
    }).when("/updateBeer/:country/:birthyear",{
       templateUrl : "EditBeers.html",
       controller : "EditBeersCtrl"
       
    });;
});
            console.log("App initialized");