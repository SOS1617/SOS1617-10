angular
    .module("SOS161710")
    .controller("BeersGraphs", ["$http", function($http) {
        console.log("Controller initialized");
        var beersbycountry = [];
        var beersfromspain = [];
        var url = "http://sos1617-10.herokuapp.com/api/v2/beers-stats";
        var apikey = "apikey=jesusguerre";
        $http.get(url + "/?" + apikey).then(function(response) {
            var countries = new Set(response.data.map(function(x) {
                return x.country;
            }));
            console.log(countries);
            countries.forEach((country) => {
                console.log(country);
                beersbycountry.push(getFromApi(country, response.data));
            });
            console.log(beersbycountry);
            showGraph();




        });

        $http.get(url + "/Spain?" + apikey).then(function(response) {
            beersfromspain.push(['City','Name','Birthyear']);
            console.log(response.data);
            response.data.forEach( (x) =>{
                beersfromspain.push([x.province,x.name,x.birthyear]);
            }); 
            
            
          
            console.log(beersfromspain);
             google.charts.setOnLoadCallback(drawMarkersMap);
            

        });


        function getFromApi(country, data) {
            var response;
            response = [country, data.filter((x) => {
                return x.country == country;
            }).length];
                

            return response;
        }

        function showGraph() {
            var chart = c3.generate({


                data: {
                    columns: beersbycountry

                    ,
                    type: 'pie',

                },
                pie: {
                    label: {
                        format: function(value, ratio, id) {
                            return d3.format('')(value);
                        }
                    }
                }
            });
        }



        google.charts.load('current', {
            'packages': ['geochart']
        });
       

        function drawMarkersMap() {
            var data = google.visualization.arrayToDataTable(beersfromspain);

            var options = {
                region: 'ES',
                displayMode: 'markers',
                colorAxis: {
                    colors: ['green', 'blue']
                }
            };

            var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        };


    }]);
