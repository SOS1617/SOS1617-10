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

            var container = document.getElementById('visualization');
                var items = lastfmData;
            
                var dataset = new vis.DataSet(items);
                var options = {
                    style:'bar',
                    barChart: {width:50, align:'center'}, // align: left, center, right
                    drawPoints: false,
                    dataAxis: {
                        icons:true
                    },
                    orientation:'top',
                };
                var graph2d = new vis.Graph2d(container, items, options);
            });
    
    
    function getFromPilot(country, data) {
        var response;
        response = [pilot, data.filter((x) => {
            return x.pilot == pilot;
        }).length];
        return response;
    }
    
}]);


