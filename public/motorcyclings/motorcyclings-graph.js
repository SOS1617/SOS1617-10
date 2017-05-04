angular
.module("SOS161710")
.controller("MotorcyclingsGraph", ["$http", function($http){
    console.log("Controller initialized");
    var motorByCountry = [];
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    
    $http
        .get(url + "/?" + apikey)
        .then(function(response) {
            var countries = new Set(response.data.map(function(x){
                return x.country;
            }));
            console.log(countries);
        })
}])