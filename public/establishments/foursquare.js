angular
    .module("SOS161710")
    .controller("Foursquare", ["$http", function($http) {
        console.log("controller initialized");

        var foursquareData = [];
        foursquareData.push(['Name', 'Number']);

        $http.get("http://sos1617-10.herokuapp.com/api/v2/establishments?apikey=nurtrioje")
            .then(function(response) {
                var aux = response.data;
                aux.forEach((x) => {
                    foursquareData.push([x.country, x.number]);
                });
            });

        $http.get("https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=44LIW13ZHFP05IZ4HWYSZUHAAWNK4JCSP30G3Y5PUV3LG5RH&client_secret=KQNCVSFKQRPQOELEN1VUCEMN5UFYV5A0XCSLSLFFVNV5ZD1O&v=20170520")
            .then(function(response) {

                var aux = response.data.response.artist;

                for (var i = 0; i < aux.length; i++) {
                    foursquareData.push([aux[i].name, aux[i].location.distance]);
                }

                google.charts.load('current', {
                    'packages': ['corechart']
                });
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {

                    var data = google.visualization.arrayToDataTable(foursquareData);

                    var options = {
                        title: 'Foursquare locations integrated with Establishments'
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

                    chart.draw(data, options);
                }
            });
    }]);
