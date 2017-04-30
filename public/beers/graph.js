angular
    .module("SOS161710")
    .controller("BeersGraphs", ["$http", function($http) {
        console.log("Controller initialized");
        var beersbycountry = [];
        var beersformap = [];
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

            beersformap.push(['Province', 'Name', 'Birthyear']);
            response.data.forEach((x) => {
                beersformap.push([x.province, x.name, x.birthyear]);
            });



            console.log(beersformap);
            google.charts.setOnLoadCallback(drawMarkersMap);


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



        google.charts.load('current', {
            'packages': ['geochart']
        });


        function drawMarkersMap() {
            var data = google.visualization.arrayToDataTable(beersformap);

            var options = {
                region: '150',
                displayMode: 'markers',
                colorAxis: {
                    colors: ['green', 'blue']
                }
            };

            var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        };

        $(function() {
            $('#timeline').highcharts({

                chart: {
                    type: 'columnrange',
                    inverted: true
                },
                title: {
                    text: 'Equipment Status'
                },
                scrollbar: {
                    enabled: true
                },
                xAxis: {
                    categories: ['Status']
                },
                yAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Timespan'
                    }
                },
                plotOptions: {
                    columnrange: {
                        grouping: false
                    }
                },
                legend: {
                    enabled: true
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + ' - ' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%e %B %H:%M', this.point.low) +
                            ' - ' + Highcharts.dateFormat('%B %e %H:%M', this.point.high) + '<br/>';
                    }
                },

                series: [{
                    name: 'Producing',
                    data: [{
                            x: 0,
                            low: Date.UTC(2013, 07, 03, 0, 0, 0),
                            high: Date.UTC(2013, 07, 03, 4, 0, 0)
                        }, {
                            x: 0,
                            low: Date.UTC(2013, 07, 03, 10, 0, 0),
                            high: Date.UTC(2013, 07, 03, 12, 0, 0)
                        }, {
                            x: 0,
                            low: Date.UTC(2013, 07, 03, 14, 0, 0),
                            high: Date.UTC(2013, 07, 03, 15, 0, 0)
                        }

                    ]
                }, {
                    name: 'Breakdown',
                    data: [{
                        x: 0,
                        low: Date.UTC(2013, 07, 03, 4, 0, 0),
                        high: Date.UTC(2013, 07, 03, 10, 0, 0)
                    }, {
                        x: 0,
                        low: Date.UTC(2013, 07, 03, 18, 0, 0),
                        high: Date.UTC(2013, 07, 03, 24, 0, 0)
                    }]
                }, {
                    name: "Changeover",
                    data: [{
                        x: 0,
                        low: Date.UTC(2013, 07, 04, 1, 0, 0),
                        high: Date.UTC(2013, 07, 04, 5, 0, 0)
                    }, {
                        x: 0,
                        low: Date.UTC(2013, 07, 02, 10, 0, 0),
                        high: Date.UTC(2013, 07, 02, 23, 0, 0)
                    }, ]
                }, {
                    name: "TrialRun",
                    data: [{
                        x: 0,
                        low: Date.UTC(2013, 07, 04, 5, 0, 0),
                        high: Date.UTC(2013, 07, 04, 13, 0, 0)
                    }, {
                        x: 0,
                        low: Date.UTC(2013, 07, 02, 2, 0, 0),
                        high: Date.UTC(2013, 07, 02, 10, 0, 0)
                    }]
                }]
            });
        });
    }]);
