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
            var cont = 1;
            var indice = 0;
            data.sort(function(a, b) {
                return a.birthyear - b.birthyear
            });
            console.log(data);
            for (var i = yearfrom; i < 2017; i++) {
                if (indice < data.length) {
                    if (i == data[indice].birthyear) {
                        beers.push(cont);
                        cont++;
                        indice++;
                    }
                }
                else {
                    beers.push(null);
                }
            }


        });
        $http.get("http://sos1617-10.herokuapp.com/api/v2/victimsproxy").then(function(response) {
            var data = response.data;
            var indice = 0;

            data.sort(function(a, b) {
                return Number(a.year) - Number(b.year);
            });
            console.log(data);
            for (var i = yearfrom; i < 2017; i++) {
                if (indice < data.length) {
                    if (i == data[indice].year) {
                        victims.push(Number(data[indice].numberVictims));

                        indice++;
                    }
                }
                else {
                    victims.push(null);
                }
            }
            console.log(beers);
            console.log(victims);

            Highcharts.chart('container', {
                chart: {
                    type: 'area'
                },
                title: {
                    text: 'US and USSR nuclear stockpiles'
                },
                subtitle: {
                    text: 'Source: <a href="http://thebulletin.metapress.com/content/c4120650912x74k7/fulltext.pdf">' +
                        'thebulletin.metapress.com</a>'
                },
                xAxis: {
                    allowDecimals: false,
                    labels: {
                        formatter: function() {
                            return this.value; // clean, unformatted number for year
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Nuclear weapon states'
                    },
                    labels: {
                        formatter: function() {
                            return this.value / 1000 + 'k';
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
                },
                plotOptions: {
                    area: {
                        pointStart: yearfrom,
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'USA',
                    data: beers
                }, {
                    name: 'USSR/Russia',
                    data: victims
                }]
            });
        });





    }]);
