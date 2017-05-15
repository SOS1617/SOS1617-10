angular
.module("SOS161710")
.controller("IntegrationAPI1MotorcyclingsGraph", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var salaryData = {};
    var salaryDataSMI = {};
    var country = [];
    var smiyear = [];
    var smiyearvariation = [];
        
    $http.get("https://sos1617-02.herokuapp.com/api/v1/smi-stats?apikey=rXD8D2b1vP").then(function(response){
        
        salaryData = response.data;
        salaryDataSMI = salaryData;
                
        for(var i=0; i<response.data.length; i++){
            country.push(salaryDataSMI[i].country);
            smiyear.push(Number(salaryDataSMI[i]["smi-year"]));
            smiyearvariation.push(Number(salaryDataSMI[i]["smi-year-variation"]));
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
            type: 'area',
            name: 'SMI Year',
            data: smiyear
        }]
    });
});

    
}]);