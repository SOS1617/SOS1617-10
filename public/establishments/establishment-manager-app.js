angular.module("EstablishmentsManagerApp", ["ngRoute"]).config(function($routeProvider) {
    
    $routeProvider
        .when("/", {
            templateUrl: "establishments-list.html",
            controller: "EstablishmentsCtrl"
        }).when("/establishment/:country/:year", {
            templateUrl: "establishments-edit.html",
            controller: "EstablishmentsEditCtrl"
        });

    console.log("App initialized and configured!");
});
