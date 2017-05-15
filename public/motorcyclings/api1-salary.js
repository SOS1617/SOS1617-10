angular
.module("SOS161710")
.controller("IntegrationAPI1MotorcyclingsGraph", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var motorcyclingsCountry = [];
    var motorcyclingsCountryGeoChart = [];
    var motorcyclingsVis = [];
        
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
        
        var cont = 0;
        response.data.forEach((x) => {
            motorcyclingsVis.push({
                id:cont,
                content:x.pilot,
                start:x.year+"-01-01",
                end:x.year+"-12-31"
            });
            cont++;
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
            innerSize: 30,
            depth: 45
        }
    },
    series: [{
        name: 'Number championship:',
        data: motorcyclingsCountry
        
        }]
    });    
        
    google.charts.load('current', {'packages':['geochart']});
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {

        var data = google.visualization.arrayToDataTable(
          motorcyclingsCountryGeoChart
        );

        var options = {
            region:'150'
        };

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
      }    
      
      
    var container = document.getElementById('visualization');

    // Create a DataSet (allows two way data-binding)
    var items = new vis.DataSet(
        motorcyclingsVis
        );

  // Configuration for the Timeline
  var options = {};

  // Create a Timeline
  var timeline = new vis.Timeline(container, items, options); 
     
    
        
});    

    
    function getFromCountry(country, data) {
        var response;
        response = [country, data.filter((x) => {
            return x.country == country;
        }).length];
        return response;
    }
}]);