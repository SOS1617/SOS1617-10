angular
    .module("SOS161710")
    .controller("BeersGraphs", ["$http", function($http) {
        console.log("Controller initialized");
        var beersbycountry = [];
        var url = "http://sos1617-10.herokuapp.com/api/v2/beers-stats";
        var apikey = "apikey=jesusguerre";
        $http.get(url + "/?" + apikey).then(function(response) {
            var countries = new Set(response.data.map(function(x) {
                return x.country;
            }));
            console.log(countries);
            countries.forEach((country) => {
                 console.log(country);
                beersbycountry.push(getFromApi(country));
            });
            console.log(beersbycountry);
            showGraph();

        });

        function getFromApi(country) {
            var response;
            $http.get(url + "/" + country + "?" + apikey).then(function(response) {
                console.log(country,response.data.length);
                response = [country, response.data.length];
            });
            return response;
        }

        function showGraph() {
            var chart = c3.generate({


                data: {
                    columns: [
                        beersbycountry

                    ],
                    type: 'pie',

                }
            });
        }


    }]);
