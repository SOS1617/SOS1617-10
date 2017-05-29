angular
    .module("SOS161710")
    .controller("Lastfm", ["$http", function($http) {
        console.log("controller initialized");
        var motorcyclingsPilot = [];
        var pilot = ["Jorge Lorenzo", "Valentino Rossi"];
        var lastfmData = [];
        lastfmData.push(['Name', 'Number']);

        $http.get("http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats?apikey=davbotcab")
            .then(function(response) {
                var pilots = new Set(response.data.map(function(x){
                    return x.pilot;
                }));
                pilots.forEach((pilot) => {
                    motorcyclingsPilot.push(getFromPilot(pilot, response.data));
                });
            });

        $http.get("http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=d9c117e532f10f87c74f225f43a7f843&user=DeiVi92&format=json")
            .then(function(response) {

                var aux = response.data.artists.artist;

                for (var i = 0; i < aux.length; i++) {
                    lastfmData.push([aux[i].name, aux[i].playcount]);
                }

            google.charts.load("current", {packages:["corechart"]});
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                  var data = google.visualization.arrayToDataTable(lastfmData);
            
                  var view = new google.visualization.DataView(data);
                  view.setColumns([0, 1,
                                   { calc: "stringify",
                                     sourceColumn: 1,
                                     type: "string",
                                     role: "annotation" },
                                   2]);
            
                  var options = {
                    title: "Density of Precious Metals, in g/cm^3",
                    width: 600,
                    height: 400,
                    bar: {groupWidth: "95%"},
                    legend: { position: "none" },
                  };
                  var chart = new google.visualization.BarChart(document.getElementById("barchart_values"));
                  chart.draw(view, options);
              }
            });
    
    
    function getFromPilot(country, data) {
        var response;
        response = [pilot, data.filter((x) => {
            return x.pilot == pilot;
        }).length];
        return response;
    }
    
}]);


