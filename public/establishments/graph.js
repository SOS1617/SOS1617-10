angular
    .module("SOS161710")
    .controller("EstablishmentsGraphs", ["$http", function($http) {
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v2/establishments";
        var apikey = "apikey=nurtrioje";
        $http.get(url + "/?" + apikey).then(function(response) {

            //*** PLOTLY ***//

            var country = [];

            var beds = [];

            var nights = [];

            response.data.forEach((x) => {
                country.push(x.country);
                beds.push(x.beds);
                nights.push(x.nights);
            });

            var trace1 = {
                type: 'scatter',
                x: beds,
                y: country,
                mode: 'markers',
                name: 'Number of beds',
                marker: {
                    color: 'rgba(156, 165, 196, 0.95)',
                    line: {
                        color: 'rgba(156, 165, 196, 1.0)',
                        width: 1,
                    },
                    symbol: 'circle',
                    size: 16
                }
            };

            var trace2 = {
                x: nights,
                y: country,
                mode: 'markers',
                name: 'Number of nights spent',
                marker: {
                    color: 'rgba(204, 204, 204, 0.95)',
                    line: {
                        color: 'rgba(217, 217, 217, 1.0)',
                        width: 1,
                    },
                    symbol: 'circle',
                    size: 16
                }
            };

            var data = [trace1, trace2];

            var layout = {
                title: 'Relation between number of beds and number of nights spent in European countries',
                xaxis: {
                    showgrid: false,
                    showline: true,
                    linecolor: 'rgb(102, 102, 102)',
                    titlefont: {
                        font: {
                            color: 'rgb(204, 204, 204)'
                        }
                    },
                    tickfont: {
                        font: {
                            color: 'rgb(102, 102, 102)'
                        }
                    },
                    autotick: false,
                    dtick: 10,
                    ticks: 'outside',
                    tickcolor: 'rgb(102, 102, 102)'
                },
                margin: {
                    l: 140,
                    r: 40,
                    b: 50,
                    t: 80
                },
                legend: {
                    font: {
                        size: 10,
                    },
                    yanchor: 'middle',
                    xanchor: 'right'
                },
                width: 1200,
                height: 650,
                paper_bgcolor: 'rgb(254, 247, 234)',
                plot_bgcolor: 'rgb(254, 247, 234)',
                hovermode: 'closest'
            };

            Plotly.newPlot('plotlyDiv', data, layout);


            //*** GOOGLE CHARTS ***//

            google.charts.load('current', {
                'packages': ['geochart']
            });
            google.charts.setOnLoadCallback(drawMarkersMap);

            var establishmentsData = [];
            establishmentsData.push(['Country', 'Beds', 'Nights']);
            response.data.forEach((x) => {
                establishmentsData.push([x.country, x.beds, x.nights]);
            });

            function drawMarkersMap() {
                var data = google.visualization.arrayToDataTable(establishmentsData);

                var options = {
                    region: '150',
                    displayMode: 'markers',
                    colorAxis: {
                        colors: ['green', 'blue']
                    }
                };

                var chart = new google.visualization.GeoChart(document.getElementById('Gchart'));
                chart.draw(data, options);
            }
        });
    }]);
