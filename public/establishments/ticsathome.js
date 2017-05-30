angular
    .module("SOS161710")
    .controller("TicsEstablishments", ["$http", function($http) {

        var countriesEstablishments = [];
        var numberEstablishments = [];

        var countriesTics = [];
        var numberTics = [];

        $http.get("http://sos1617-10.herokuapp.com/api/v2/establishments?apikey=nurtrioje").then(function(response) {

            response.data.forEach((x) => {
                countriesEstablishments.push(x.country);
                numberEstablishments.push(x.number);
            });

        });

        $http.get("http://sos1617-09.herokuapp.com/api/v2/ticsathome-stats?apikey=ticsathomeLuis").then(function(response) {

            response.data.forEach((x) => {
                countriesTics.push(x.country);
                numberTics.push(x.tablet);
            });


            var trace1 = {
                type: 'scatter',
                x: numberEstablishments,
                y: countriesEstablishments,
                mode: 'markers',
                name: 'Number of establishments',
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
                x: numberTics,
                y: countriesTics,
                mode: 'markers',
                name: 'Number of tablets at home',
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
                title: 'Relation between number of establishments and number of tablets at home in European countries',
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

            Plotly.newPlot('TicsEstablishmentsPlotly', data, layout);


        });

    }]);
