angular
.module("SOS161710")
.controller("MotorcyclingsGraphs", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var motorcyclingsCountry = [];
    var motorcyclingsCountryGeoChart = [];
        
    $http.get(url + "/?" + apikey).then(function(response){
        var countries = new Set(response.data.map(function(x){
            return x.country;
        }));
        countries.forEach((country) => {
            motorcyclingsCountry.push(getFromCountry(country, response.data));
            
        });
        motorcyclingsCountryGeoChart.push(['Country', 'Championships']);
        motorcyclingsCountry.forEach((x) => {
            motorcyclingsCountryGeoChart.push(x);
        });
        console.log(motorcyclingsCountryGeoChart)
        
        
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
            innerSize: 30,
            depth: 45
        }
    },
    series: [{
        name: 'Delivered amount',
        data: motorcyclingsCountry
        
        }]
    });    
        
    google.charts.load('current', {'packages':['geochart']});

    function drawRegionsMap() {

        var data = google.visualization.arrayToDataTable(
          motorcyclingsCountryGeoChart
        );

        var options = {};

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
      }    
        
});    

    
    function getFromCountry(country, data) {
        var response;
        response = [country, data.filter((x) => {
            return x.country == country;
        }).length];
        return response;
    }
}]);