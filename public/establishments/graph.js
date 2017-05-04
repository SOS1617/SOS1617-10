angular
    .module("SOS161710")
    .controller("EstablishmentsGraphs", ["$http", function($http) {
        console.log("Controller initialized");
        var beersbycountry = [];
        var beersformap = [];
        var beersfortimeline = [];
        var url = "http://sos1617-10.herokuapp.com/api/v2/establishments";
        var apikey = "apikey=nurtrioje";
        $http.get(url + "/?" + apikey).then(function(response) {
            TESTER = document.getElementById('tester');
            Plotly.plot(TESTER, [{
                x: [1, 2, 3, 4, 5],
                y: [1, 2, 4, 8, 16]
            }], {
                margin: {
                    t: 0
                }
            });
        });
    }]);
