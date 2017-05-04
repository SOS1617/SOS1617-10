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
    google.charts.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() {

        var data = google.visualization.arrayToDataTable(
          motorcyclingsCountryGeoChart
        );

        var options = {};

        var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

        chart.draw(data, options);
      }    
        
});    

    
    var names = ['centripetal', 'chordal', 'uniform', 'disabled'];
    var groups = new vis.DataSet();
    groups.add({
        id: 0,
        content: names[0],
        options: {
            drawPoints: false,
            interpolation: {
                parametrization: 'centripetal'
            }
        }});

    groups.add({
        id: 1,
        content: names[1],
        options: {
            drawPoints: false,
            interpolation: {
                parametrization: 'chordal'
            }
        }});

    groups.add({
        id: 2,
        content: names[2],
        options: {
            drawPoints: false,
            interpolation: {
                parametrization: 'uniform'
            }
        }
    });

    groups.add({
        id: 3,
        content: names[3],
        options: {
            drawPoints: { style: 'circle' },
            interpolation: false
        }});

    var container = document.getElementById('visualization');
    var dataset = new vis.DataSet();
    for (var i = 0; i < names.length; i++) {
        dataset.add( [
            {x: '2014-06-12', y: 0 , group: i},
            {x: '2014-06-13', y: 40, group: i},
            {x: '2014-06-14', y: 10, group: i},
            {x: '2014-06-15', y: 15, group: i},
            {x: '2014-06-15', y: 30, group: i},
            {x: '2014-06-17', y: 10, group: i},
            {x: '2014-06-18', y: 15, group: i},
            {x: '2014-06-19', y: 52, group: i},
            {x: '2014-06-20', y: 10, group: i},
            {x: '2014-06-21', y: 20, group: i}
        ]);
    }

    var options = {
        drawPoints: false,
        dataAxis: {visible: false},
        legend: true,
        start: '2014-06-11',
        end: '2014-06-22'
    };
    var graph2d = new vis.Graph2d(container, dataset, groups, options);


    
    function getFromCountry(country, data) {
        var response;
        response = [country, data.filter((x) => {
            return x.country == country;
        }).length];
        return response;
    }
}]);