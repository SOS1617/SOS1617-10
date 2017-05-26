angular
    .module("SOS161710")
    .controller("GroupAnalytics", ["$http", function($http) {
        console.log("Group Analytics initialized");
        var beersbycountry = [];
        var dataToGraph = [];
        var establishmentsbycountry=[];
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
            
        });
        $http.get("/api/v2/establishments/?apikey=nurtrioje").then(function(response){
           var establishments=response.data;
           countries.forEach( (x)=>{
               establishments.forEach( (y)=>{
                   if(y.country==x){
                       establishmentsbycountry.push(y.number);
                   }else{
                       establishmentsbycountry.push(0.);
                   }
               });
           });
           
           for (var index = 0; index < countries.length; index++) {
                dataToGraph.push([countries[index], beersbycountry[index], establishmentsbycountry[index], 0.]);
            }


            show();
        });







        function show() {

            google.charts.load('current', {
                'packages': ['corechart']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(dataToGraph);

                var options = {
                    title: 'The decline of \'The 39 Steps\'',
                    vAxis: {
                        title: 'Accumulated Rating'
                    },
                    isStacked: true
                };

                var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div'));

                chart.draw(data, options);
            }
        }



    }]);
