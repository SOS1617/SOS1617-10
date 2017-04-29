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
        
        
        
     google.charts.load('current', {'packages': ['geochart']});
     google.charts.setOnLoadCallback(drawMarkersMap);

      function drawMarkersMap() {
      var data = google.visualization.arrayToDataTable([
        ['City',   'Population', 'Area'],
        ['Rome',      2761477,    1285.31],
        ['Milan',     1324110,    181.76],
        ['Naples',    959574,     117.27],
        ['Turin',     907563,     130.17],
        ['Palermo',   655875,     158.9],
        ['Genoa',     607906,     243.60],
        ['Bologna',   380181,     140.7],
        ['Florence',  371282,     102.41],
        ['Fiumicino', 67370,      213.44],
        ['Anzio',     52192,      43.43],
        ['Ciampino',  38262,      11]
      ]);

      var options = {
        region: 'IT',
        displayMode: 'markers',
        colorAxis: {colors: ['green', 'blue']}
      };

      var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    };
        

    }]);
