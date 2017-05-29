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

        $http.get("ttps://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=44LIW13ZHFP05IZ4HWYSZUHAAWNK4JCSP30G3Y5PUV3LG5RH&client_secret=KQNCVSFKQRPQOELEN1VUCEMN5UFYV5A0XCSLSLFFVNV5ZD1O&v=20170520")
            .then(function(response) {

                var aux = response.data.response.venues;

                for (var i = 0; i < aux.length; i++) {
                    lastfmData.push([aux[i].name, aux[i].distance]);
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


