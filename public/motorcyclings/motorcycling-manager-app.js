angular.module("MotorcyclingsManagerApp",["ngRoute"]).config(function($routeProvider) {
    
    $routeProvider
        .when("/", {
            templateUrl:"motorcyclings-list.html",
            controller:"MotorcyclingsCtrl"
        });

    console.log("App initialized and configured");
    
});