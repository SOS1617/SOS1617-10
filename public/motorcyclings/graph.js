angular
.module("SOS161710")
.controller("MotorcyclingsGraphs", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var country = [];
    var pilot = [];
    var team = [];
        
    $http.get(url + "/?" + apikey).then(function(response){
        response.data.forEach((x) => {
            country.push(x.country);
            pilot.push(x.pilot);
            team.push(x.team);
            });
            
    
    });    
            
        
    Highcharts.chart('myGraph3d', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: 'Number of Pilots Champions by Country'
    },
    subtitle: {
        text: '3D donut in Highcharts'
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45
        }
    },
    series: [{
        name: 'Delivered amount',
        data: [
            [country, pilot]
        ]
    }]
});


}]);