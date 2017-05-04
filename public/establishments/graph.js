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
            Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv', function(err, rows) {
                var YEAR = 2014;
                var countries = ['Asia', 'Europe', 'Africa', 'Oceania', 'Americas'];
                var POP_TO_PX_SIZE = 2e5;

                function unpack(rows, key) {
                    return rows.map(function(row) {
                        return row[key];
                    });
                }

                var data = countries.map(function(country) {
                    var rowsFiltered = rows.filter(function(row) {
                        console.log(rowsFiltered);
                        return (row.country === country) && (+row.year === YEAR);
                    });
                    return {
                        mode: 'markers',
                        name: country,
                        x: unpack(rowsFiltered, 'lifeExp'),
                        y: unpack(rowsFiltered, 'gdpPercap'),
                        text: unpack(rowsFiltered, 'country'),
                        marker: {
                            sizemode: 'area',
                            size: unpack(rowsFiltered, 'pop'),
                            sizeref: POP_TO_PX_SIZE
                        }
                    };
                });
                var layout = {
                    xaxis: {
                        title: 'Beds'
                    },
                    yaxis: {
                        title: 'Nights',
                        type: 'log'
                    },
                    margin: {
                        t: 20
                    },
                    hovermode: 'closest'
                };
                Plotly.plot('my-graph', data, layout, {
                    showLink: false
                });
            });
        });
    }]);
