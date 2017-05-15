angular
    .module("SOS161710")
    .controller("Victims", ["$http", function($http) {
        console.log("Controller initialized!");
        var beers = [];
        var victims = [];
        var yearfrom = 1900
        var datatoshow = [];
        $http.get("http://sos1617-10.herokuapp.com/api/v2/beers-stats/?from=" + yearfrom + "&apikey=jesusguerre").then(function(response) {
            var data = response.data;


            data.forEach((x) => {
                beers.push(Date.UTC(x.birthyear, 11, 31));
            });



        });
        $http.get("http://sos1617-10.herokuapp.com/api/v2/victimsproxy").then(function(response) {
            var data = response.data;


            data.forEach((x) => {
                victims.push(Number(x.numberVictims));
            });
            var longitud = Math.min(beers.length, victims.length);
            for (var i = 0; i < longitud; i++) {
                datatoshow.push([beers[i], victims[i]]);
            }
            console.log(datatoshow);
             $('#container').highcharts({
                chart: {
                    type: 'heatmap'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    categories: ['a', 'b']
                },
                colorAxis: {
                    min: 0,
                    max: 1,
                    minColor: '#a50022',
                    maxColor: '#007340',
                    gridLineColor: '#000000',
                    stops: [
                        [0, '#a50022'],
                        [0.5, '#fffbbc'],
                        [1, '#007340']
                    ],
                },
                series: [{
                    colsize: 24 * 36e5, // one day
                    data: datatoshow
                }]
            });
        });








       

       




    }]);
