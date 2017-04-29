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
                beersbycountry.push(getFromApi(country, response.data));
            });
            console.log(beersbycountry);
            showGraph();

        });

        function getFromApi(country, data) {
            var response;
            response = [country, data.filter((x) => {
                return x.country == country;
            }).length];


            return response;
        }

        function showGraph() {
            var chart = c3.generate({


                data: {
                    columns: beersbycountry

                    ,
                    type: 'pie',

                },
                pie: {
                    label: {
                        format: function(value, ratio, id) {
                            return d3.format('')(value);
                        }
                    }
                }
            });
        }


    }]);
