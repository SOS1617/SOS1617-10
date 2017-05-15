angular
.module("SOS161710")
.controller("IntegrationAPI2MotorcyclingsGraph", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var wagesData = {};
    var province = [];
    var varied = [];
    var averageWage = [];
        
    var motorcyclingsCountry = [];
    
    $http.get(url + "/?" + apikey).then(function(response){
        var countries = new Set(response.data.map(function(x){
            return x.country;
        }));
        countries.forEach((country) => {
            motorcyclingsCountry.push(getFromCountry(country, response.data));
            
        });
    });
    
        
    $http.get("https://sos1617-08.herokuapp.com/api/v1/wages/?apikey=hf5HF86KvZ").then(function(response){
        
        wagesData = response.data;
                
        for(var i=0; i<response.data.length; i++){
            province.push(wagesData[i].province);
            varied.push(Number(wagesData[i]["varied"]));
            averageWage.push(Number(wagesData[i]["averageWage"]));
        }
        
        
    Highcharts.chart('container', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Wages Over Time'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            categories: province
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
                    name: 'Wages',
                    data: varied
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