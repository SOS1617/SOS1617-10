angular
    .module("SOS161710")
    .controller("Voting", ["$http", function($http) {
        console.log("Controller initialized!");
        var beers = [];
        var voting = [];
        var provinces = ["Sevilla", "La Coruña", "Barcelona"];
        $http.get("http://sos1617-10.herokuapp.com/api/v2/beers-stats/?apikey=jesusguerre").then(function(response) {
            var data = response.data;

            provinces.forEach((prov) => {
                var cont = 0;
                data.forEach((x) => {
                    if (x.province == prov) {
                        cont++;
                    }
                });
                beers.push(cont);
            });

        });

        $http.get("https://sos1617-05.herokuapp.com/api/v1/elections-voting-stats?apikey=cinco").then(function(response) {

            var data = response.data;

            provinces.forEach((prov) => {
                var exist = false;
                data.forEach((x) => {
                    if (x.province == prov) {
                       var podemos = Number(x.podemos);
                       voting.push(podemos);
                       exist = true;
                    }
                });
                if (exist == false) {
                    voting.push(0);
                }
            });
            
        console.log(beers);
        console.log(voting);



            Highcharts.chart('container', {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Beers and Voting podemos by province'
                },
                subtitle: {
                    text: 'Source: sos'
                },
                xAxis: {
                    categories: provinces
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    name: 'Beers',
                    data: beers
                }, {
                    name: 'Voting',
                    data: voting
                }]
            });
        });





    }]);
