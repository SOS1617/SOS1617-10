angular.module("MotorcyclingsManagerApp",["ngRoute"]).config(function($routeProvider) {
    
    $routeProvider
        .when("/", {
            templateUrl:"motorcyclings-list.html",
            controller:"MotorcyclingsCtrl"
        }).when("/updateEstablishment/:country/:year", {
            templateUrl: "motorcyclings-edit.html",
            controller: "MotorcyclingsEditCtrl"
        });;

    console.log("App initialized and configured");
    
});