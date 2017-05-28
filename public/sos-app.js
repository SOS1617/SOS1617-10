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
        
    }).when("/beers/graphs/victims",{
        templateUrl : "/beers/victims.html",
        controller: "Victims"
        
    }).when("/beers/graphs/voting",{
        templateUrl : "/beers/voting.html",
        controller: "Voting"
    }).when("/establishments/", {
        templateUrl: "/establishments/establishments-list.html",
        controller: "EstablishmentsCtrl"

    }).when("/establishments/updateEstablishment/:country/:year", {
        templateUrl: "/establishments/establishments-edit.html",
        controller: "EstablishmentsEditCtrl"
        
    }).when("/establishments/graphs/", {
        templateUrl: "/establishments/graph.html",
        controller: "EstablishmentsGraphs"

    }).when("/establishments/graphs/api1", {
        templateUrl: "/establishments/api1.html",
        controller: "IntegrationAPI1EstablishmentsGraph"

    }).when("/establishments/graphs/api2", {
        templateUrl: "/establishments/api2.html",
        controller: "IntegrationAPI2EstablishmentsGraph"

    }).when("/establishments/graphs/foursquare", {
        templateUrl: "/establishments/foursquare.html",
        controller: "Foursquare"

    }).when("/establishments/graphs/restcountries", {
        templateUrl: "/establishments/restcountries.html",
        controller: "RestCountries"

    }).when("/motorcyclings/", {
        templateUrl: "/motorcyclings/motorcyclings-list.html",
        controller: "MotorcyclingsCtrl"

    }).when("/motorcyclings/updateMotorcycling/:country/:year", {
        templateUrl: "/motorcyclings/motorcyclings-edit.html",
        controller: "MotorcyclingsEditCtrl"
        
    }).when("/motorcyclings/graphs/", {
        templateUrl: "/motorcyclings/graph.html",
        controller: "MotorcyclingsGraphs"
        
    }).when("/motorcyclings/graphs/api1-salary", {
        templateUrl: "/motorcyclings/api1-salary.html",
        controller: "IntegrationAPI1MotorcyclingsGraph"

    }).when("/motorcyclings/graphs/api2-wages", {
        templateUrl: "/motorcyclings/api2-wages.html",
        controller: "IntegrationAPI2MotorcyclingsGraph"
        
    }).when("/analytics",{
         templateUrl : "analytics.html",
         controller: "GroupAnalytics"
         
    }).when("/governance",{
        templateUrl: "governance.html"
        
    }).when("/integrations",{
        templateUrl: "integrations.html"
        
    }).when("/about",{
        templateUrl: "about.html"
        
    }).when("/beers/graphs/games/",{
        templateUrl : "/beers/game.html",
        controller : "Games"
    }).when("/beers/graphs/twitter/",{
        templateUrl: "/beers/twitter.html",
        controller: "TwitterInt"
    }).when("/beers/graphs/d3/",{
        templateUrl:"/beers/d3.html",
        controller: "D3Beers"
    }).when("/beers/graphs/instagram/",{
        templateUrl:"/beers/instagram.html",
        controller: "InstaGraph"
    });
});
console.log("App initialized");
