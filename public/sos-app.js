angular.module("SOS161710",["ngRoute"]).config(function ($routeProvider){
    $routeProvider.when("/",{
        templateUrl : "home.html"  
    }).when("/beers/",{
        templateUrl : "/beers/BeersList.html",
        controller : "BeersCtrl"
        
    }).when("/beers/updateBeer/:country/:birthyear",{
       templateUrl : "/beers/EditBeers.html",
       controller : "EditBeersCtrl"
       
    });;
});
            console.log("App initialized");