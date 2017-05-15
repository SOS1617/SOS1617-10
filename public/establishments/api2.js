angular
    .module("SOS161710")
    .controller("IntegrationAPI2EstablishmentsGraph", ["$http", function($http) {
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v2/establishments";
        var apikey = "apikey=nurtrioje";
        $http.get(url + "/?" + apikey).then(function(response) {
            Highcharts.chart('api2-establishments', {

                title: {
                    text: 'Logarithmic axis demo'
                },

                xAxis: {
                    tickInterval: 1
                },

                yAxis: {
                    type: 'logarithmic',
                    minorTickInterval: 0.1
                },

                tooltip: {
                    headerFormat: '<b>{series.name}</b><br />',
                    pointFormat: 'x = {point.x}, y = {point.y}'
                },

                series: [{
                    data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
                    pointStart: 1
                }, {
                    data: [3, 4, 6, 10, 18, 34, 66, 130, 258, 514],
                    pointStart: 3
                }]
            });

        });
    }]);
