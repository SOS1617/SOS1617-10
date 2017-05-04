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

            Highcharts.chart('establishmentsHighchart', {

                chart: {
                    type: 'bubble',
                    plotBorderWidth: 1,
                    zoomType: 'xy'
                },

                legend: {
                    enabled: false
                },

                title: {
                    text: 'Sugar and fat intake per country'
                },

                subtitle: {
                    text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
                },

                xAxis: {
                    gridLineWidth: 1,
                    title: {
                        text: 'Daily fat intake'
                    },
                    labels: {
                        format: '{value} gr'
                    },
                    plotLines: [{
                        color: 'black',
                        dashStyle: 'dot',
                        width: 2,
                        value: 65,
                        label: {
                            rotation: 0,
                            y: 15,
                            style: {
                                fontStyle: 'italic'
                            },
                            text: 'Safe fat intake 65g/day'
                        },
                        zIndex: 3
                    }]
                },

                yAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    title: {
                        text: 'Daily sugar intake'
                    },
                    labels: {
                        format: '{value} gr'
                    },
                    maxPadding: 0.2,
                    plotLines: [{
                        color: 'black',
                        dashStyle: 'dot',
                        width: 2,
                        value: 50,
                        label: {
                            align: 'right',
                            style: {
                                fontStyle: 'italic'
                            },
                            text: 'Safe sugar intake 50g/day',
                            x: -10
                        },
                        zIndex: 3
                    }]
                },

                tooltip: {
                    useHTML: true,
                    headerFormat: '<table>',
                    pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                        '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
                        '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
                        '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
                    footerFormat: '</table>',
                    followPointer: true
                },

                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }
                },

                series: [{
                    data: [{
                        x: 95,
                        y: 95,
                        z: 13.8,
                        name: 'BE',
                        country: 'Belgium'
                    }, {
                        x: 86.5,
                        y: 102.9,
                        z: 14.7,
                        name: 'DE',
                        country: 'Germany'
                    }, {
                        x: 80.8,
                        y: 91.5,
                        z: 15.8,
                        name: 'FI',
                        country: 'Finland'
                    }, {
                        x: 80.4,
                        y: 102.5,
                        z: 12,
                        name: 'NL',
                        country: 'Netherlands'
                    }, {
                        x: 80.3,
                        y: 86.1,
                        z: 11.8,
                        name: 'SE',
                        country: 'Sweden'
                    }, {
                        x: 78.4,
                        y: 70.1,
                        z: 16.6,
                        name: 'ES',
                        country: 'Spain'
                    }, {
                        x: 74.2,
                        y: 68.5,
                        z: 14.5,
                        name: 'FR',
                        country: 'France'
                    }, {
                        x: 73.5,
                        y: 83.1,
                        z: 10,
                        name: 'NO',
                        country: 'Norway'
                    }, {
                        x: 71,
                        y: 93.2,
                        z: 24.7,
                        name: 'UK',
                        country: 'United Kingdom'
                    }, {
                        x: 69.2,
                        y: 57.6,
                        z: 10.4,
                        name: 'IT',
                        country: 'Italy'
                    }, {
                        x: 68.6,
                        y: 20,
                        z: 16,
                        name: 'RU',
                        country: 'Russia'
                    }, {
                        x: 65.5,
                        y: 126.4,
                        z: 35.3,
                        name: 'US',
                        country: 'United States'
                    }, {
                        x: 65.4,
                        y: 50.8,
                        z: 28.5,
                        name: 'HU',
                        country: 'Hungary'
                    }, {
                        x: 63.4,
                        y: 51.8,
                        z: 15.4,
                        name: 'PT',
                        country: 'Portugal'
                    }, {
                        x: 64,
                        y: 82.9,
                        z: 31.3,
                        name: 'NZ',
                        country: 'New Zealand'
                    }]
                }]

            });
        });
    }]);
