angular
    .module("SOS161710")
    .controller("Lastfm", ["$http", function($http) {
        console.log("controller initialized");
        var motorcyclingsCountry = [];
        var country = ["United Kingdom", "Italy", "Spain"];
        var lastfmData = [];
        lastfmData.push(['Name', 'Number']);

        $http.get("http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats?apikey=davbotcab")
            .then(function(response) {
                var countries = new Set(response.data.map(function(x){
                    return x.country;
                }));
                countries.forEach((country) => {
                    motorcyclingsCountry.push(getFromCountry(country, response.data));
                });
            });

        $http.get("http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=d9c117e532f10f87c74f225f43a7f843&user=DeiVi92&format=json")
            .then(function(response) {

                var aux = response.data.response.artist;

                for (var i = 0; i < aux.length; i++) {
                    lastfmData.push([aux[i].name, aux[i].playcount]);
                }

                google.charts.load('current', {
                    'packages': ['corechart']
                });
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {

                    var data = google.visualization.arrayToDataTable(lastfmData);

                    var options = {
                        title: 'LastFM locations integrated with Motorcyclings'
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

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


