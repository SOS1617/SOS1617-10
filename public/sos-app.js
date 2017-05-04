angular.module("SOS161710", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "/home.html",
    }).when("/beers/", {
        templateUrl: "/beers/BeersList.html",
        controller: "BeersCtrl"

    }).when("/beers/updateBeer/:country/:birthyear", {
        templateUrl: "/beers/EditBeers.html",
        controller: "EditBeersCtrl"

    }).when("/beers/graphs/", {
        templateUrl: "/beers/graph.html",
        controller: "BeersGraphs"
        
    }).when("/establishments/", {
        templateUrl: "/establishments/establishments-list.html",
        controller: "EstablishmentsCtrl"

    }).when("/establishments/updateEstablishment/:country/:year", {
        templateUrl: "/establishments/establishments-edit.html",
        controller: "EstablishmentsEditCtrl"
        
    }).when("/establishments/graphs/", {
        templateUrl: "/establishments/graph.html",
        controller: "EstablishmentsGraphs"

    }).when("/motorcyclings/", {
        templateUrl: "/motorcyclings/motorcyclings-list.html",
        controller: "MotorcyclingsCtrl"

    }).when("/motorcyclings/updateMotorcycling/:country/:year", {
        templateUrl: "/motorcyclings/motorcyclings-edit.html",
        controller: "MotorcyclingsEditCtrl"
        
    }).when("/motorcyclings/graphs/", {
        templateUrl: "/motorcyclings/graph.html",
        controller: "MotorcyclingsGraphs"
    });
});
console.log("App initialized");
