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

                google.charts.load('current', {packages: ['corechart', 'bar']});
                google.charts.setOnLoadCallback(drawAnnotations);
                
                function drawAnnotations() {
                      var data = google.visualization.arrayToDataTable(lastfmData);
                
                      var data = google.visualization.arrayToDataTable(lastfmData);
                
                      var options = {
                        title: 'Population of Largest U.S. Cities',
                        chartArea: {width: '50%'},
                        annotations: {
                          alwaysOutside: true,
                          textStyle: {
                            fontSize: 12,
                            auraColor: 'none',
                            color: '#555'
                          },
                          boxStyle: {
                            stroke: '#ccc',
                            strokeWidth: 1,
                            gradient: {
                              color1: '#f3e5f5',
                              color2: '#f3e5f5',
                              x1: '0%', y1: '0%',
                              x2: '100%', y2: '100%'
                            }
                          }
                        },
                        hAxis: {
                          title: 'Number',
                          minValue: 0,
                        },
                        vAxis: {
                          title: 'Name'
                        }
                      };
                      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
                      chart.draw(data, options);
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


