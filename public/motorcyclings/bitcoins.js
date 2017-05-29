angular
.module("SOS161710")
.controller("Bitcoins", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var bitcoinsData = {};
    var name = [];
    var rate_float = [];
        
    var motorcyclingsCountry = [];
    
    $http.get(url + "/?" + apikey).then(function(response){
        var countries = new Set(response.data.map(function(x){
            return x.country;
        }));
        countries.forEach((country) => {
            motorcyclingsCountry.push(getFromCountry(country, response.data));
            
        });
    });
    
        
    $http.get("http://api.coindesk.com/v1/bpi/currentprice.json").then(function(response){
        
        bitcoinsData = response.data;
                
        for(var i=0; i<bitcoinsData.length; i++){
            name.push(bitcoinsData[i].name);
            rate_float.push(Number(bitcoinsData[i].rate_float));
        }
        
        
    Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Lastfm ft Motorcyclings'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            categories: name
        },
        yAxis: {
            title: {
                text: 'Exchange rate'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series:[{   type: 'area',
                    name: 'Motorcyclings',
                    data: motorcyclingsCountry
                }, {
                    type: 'area',
                    name: 'rate_float',
                    data: rate_float
         }]
    });

    
});

function getFromCountry(country, data) {
        var response;
        response = [country, data.filter((x) => {
            return x.country == country;
        }).length];
        return response;
    }

    
}]);