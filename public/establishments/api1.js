angular
    .module("SOS161710")
    .controller("IntegrationAPI1EstablishmentsGraph", ["$http", function($http) {
                console.log("Controller initialized");
                var url = "http://sos1617-10.herokuapp.com/api/v2/establishments";
                var apikey = "apikey=nurtrioje";
                $http.get(url + "/?" + apikey).then(function(response) {
                    
                    
                });
    }]);