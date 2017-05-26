angular
    .module("SOS161710")
    .controller("GroupAnalytics", ["$http", function($http) {
        console.log("Group Analytics initialized");
        var beersbycountry = [];
        var dataToGraph = [];
        var establishmentsbycountry = [];
        var motorcyclingstograph = [];
        dataToGraph.push(["Country", "beers", "establishments", "motorcyclings"]);
        var countries = ["Spain", "France", "Germany", "Italy"];

        $http.get("/api/v2/beers-stats/?apikey=jesusguerre").then(function(response) {
            var beers = response.data;

            countries.forEach((x) => {
                var cont = 0.0;
                beers.forEach((y) => {
                    if (y.country == x) {
                        cont++;
                    }
                });
                beersbycountry.push(cont);

            });


            $http.get("/api/v2/establishments/?apikey=nurtrioje").then(function(response) {
                var establishments = response.data;
                countries.forEach((x) => {
                    var exist = false;
                    establishments.forEach((y) => {
                        if (y.country.toLowerCase() == x.toLowerCase()) {
                            establishmentsbycountry.push(y.number/10000);
                            exist = true;
                        }
                    });
                    if (exist == false) {
                        establishmentsbycountry.push(0);
                    }
                    console.log(establishmentsbycountry);
                });

                $http.get("/api/v2/motorcycling-stats/?apikey=davbotcab").then(function(response) {
                    var motorcyclings = response.data;

                    countries.forEach((x) => {
                        var cont = 0.0;
                        motorcyclings.forEach((y) => {
                            if (y.country == x) {
                                cont++;
                            }
                        });
                        motorcyclingstograph.push(cont);



                    });
                    for (var index = 0; index < countries.length; index++) {

                        dataToGraph.push([countries[index], beersbycountry[index], establishmentsbycountry[index], motorcyclingstograph[index]]);
                        console.log(dataToGraph);

                    }


                    show();

                });




            });


        });







        function show() {

            google.charts.load('current', {
                'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(dataToGraph);

                var options = {
                    title: 'Integration of Beers, Establishments and Motorcycling in European countries',
                    vAxis: {
                        title: 'Number of beer brands, establishments by 10000 and motorcyclings champions per country'
                    },
                    isStacked: true
                };

                var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));

                chart.draw(data, options);
            }
        }



    }]);
