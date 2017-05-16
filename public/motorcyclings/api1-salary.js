angular
.module("SOS161710")
.controller("IntegrationAPI1MotorcyclingsGraph", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var salaryData = {};
    var country = ["United Kingdom", "Italy", "Spain"];
    var smiyear = [];
    
    var motorcyclingsCountry = [];
    
    $http.get(url + "/?" + apikey).then(function(response){
        var countries = new Set(response.data.map(function(x){
            return x.country;
        }));
        countries.forEach((country) => {
            motorcyclingsCountry.push(getFromCountry(country, response.data));
            
    });
    });
        
    $http.get("http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats/salaryproxy").then(function(response){
        var indice = 0;
        
        salaryData = response.data;
        
                
        for(var i=0; i<country.length; i++){
            if(country[i] == salaryData[indice].country) {
                smiyear.push(Number(salaryData[indice]["smi-year"]));
                indice++;
            }
            
        }
        
        
        
        
        
    Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'SMI over time'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            categories: country
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

        series: [{
                    name: 'Motorcyclings',
                    data: motorcyclingsCountry
                }, {
                    name: 'SMI',
                    data: smiyear
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
    