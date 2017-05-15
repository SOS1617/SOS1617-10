angular
.module("SOS161710")
.controller("IntegrationAPI1MotorcyclingsGraph", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    
    
    $http.get(url + "/?" + apikey).then(function(response) {
    
        var country = [];
        var smiyear = [];
        var smiyearvariation = [];

        response.data.forEach((x) => {
            country.push(x.country);
            smiyear.push(x.smiyear);
            smiyearvariation.push(x.smiyearvariation);
            });
        
        
        
        
        
        google.charts.load('current', {
            'packages': ['geochart']
        });
        google.charts.setOnLoadCallback(drawMarkersMap);

        var salariesData = [];
        salariesData.push(['Country', 'Smiyear', 'Smiyearvariation']);
        response.data.forEach((x) => {
            salariesData.push([x.country, x.smiyear, x.smiyearvariation]);
        });

        function drawMarkersMap() {
            var data = google.visualization.arrayToDataTable(salariesData);
                var options = {
                region: '150',
                displayMode: 'markers',
                colorAxis: {
                    colors: ['#58ACFA', '#B40431']
                }
            };

            var chart = new google.visualization.GeoChart(document.getElementById('Gchart'));
            chart.draw(data, options);
        }
     
    
        
});    

}]);