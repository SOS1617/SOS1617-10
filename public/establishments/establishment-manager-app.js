angular.module("SOS161710", ["ngRoute"]).config(function($routeProvider) {
    
    $routeProvider
        .when("/", {
            templateUrl: "establishments-list.html",
            controller: "EstablishmentsCtrl"
        }).when("/updateEstablishment/:country/:year", {
            templateUrl: "establishments-edit.html",
            controller: "EstablishmentsEditCtrl"
        });

    console.log("App initialized and configured!");
});
