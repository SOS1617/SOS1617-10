angular.module("EstablishmentsManagerApp", ["ngRoute"]).config(function($routeProvider) {
    
    $routeProvider
        .when("/", {
            templateUrl: "establishments-list.html",
            controller: "EstablishmentsCtrl"
        });

    console.log("App initialized and configured!");
});
