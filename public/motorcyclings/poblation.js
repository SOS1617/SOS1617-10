angular
.module("SOS161710")
.controller("Poblation", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var poblationData = [];
    poblationData.push(['Name', 'Number']);
    
    $http.get(url + "/?" + apikey).then(function(response){
              var res = response.data;
                res.forEach((x) => {
                    poblationData.push([x.pilot, x.year]);
                });
            });
    
        
    $http.get("http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo").then(function(response){
        
        var res = response.data.geonames;
                
        for(var i=0; i<res.length; i++){
            poblationData.push([res[i].name, res[i].population]);
        }
        
        
              google.charts.load("current", {packages:["corechart"]});
              google.charts.setOnLoadCallback(drawChart);
              function drawChart() {
                var data = google.visualization.arrayToDataTable(poblationData);
        
                var options = {
                  title: 'My Daily Activities',
                  pieHole: 0.4,
                };
        
                var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
                chart.draw(data, options);
              }

    
});




    
}]);