angular
    .module("SOS161710")
    .controller("EstablishmentsGraphs", ["$http", function($http) {
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v2/establishments";
        var apikey = "apikey=nurtrioje";
        $http.get(url + "/?" + apikey).then(function(response) {

            //************************* PLOTLY *************************//

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


            //************************* GOOGLE CHARTS *************************//

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

            //************************* HIGHCHARTS *************************//

            Highcharts.chart('container', {

                chart: {
                    type: 'bubble',
                    plotBorderWidth: 1,
                    zoomType: 'xy'
                },

                title: {
                    text: 'Highcharts bubbles with radial gradient fill'
                },

                xAxis: {
                    gridLineWidth: 1
                },

                yAxis: {
                    startOnTick: false,
                    endOnTick: false
                },

                series: [{
                    data: [
                        [9, 81, 63],
                        [98, 5, 89],
                        [51, 50, 73],
                        [41, 22, 14],
                        [58, 24, 20],
                        [78, 37, 34],
                        [55, 56, 53],
                        [18, 45, 70],
                        [42, 44, 28],
                        [3, 52, 59],
                        [31, 18, 97],
                        [79, 91, 63],
                        [93, 23, 23],
                        [44, 83, 22]
                    ],
                    marker: {
                        fillColor: {
                            radialGradient: {
                                cx: 0.4,
                                cy: 0.3,
                                r: 0.7
                            },
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                }, {
                    data: [
                        [42, 38, 20],
                        [6, 18, 1],
                        [1, 93, 55],
                        [57, 2, 90],
                        [80, 76, 22],
                        [11, 74, 96],
                        [88, 56, 10],
                        [30, 47, 49],
                        [57, 62, 98],
                        [4, 16, 16],
                        [46, 10, 11],
                        [22, 87, 89],
                        [57, 91, 82],
                        [45, 15, 98]
                    ],
                    marker: {
                        fillColor: {
                            radialGradient: {
                                cx: 0.4,
                                cy: 0.3,
                                r: 0.7
                            },
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                }]

            });
        });
    }]);
