angular
    .module("SOS161710")
    .controller("BeersGraphs", ["$http", function($http) {
        console.log("Controller initialized");
        var beersbycountry = [];
        var beersformap = [];
        var beersfortimeline=[];
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

            beersformap.push(['Province', 'Name', 'Birthyear']);
            response.data.forEach( (x) =>{
                beersformap.push([x.province,x.name,x.birthyear]); //geochart
                beersfortimeline.push({"name":x.name , "data":[{x:0,low: Date.UTC(x.birthyear,00,01,0,0,0),high:Date.UTC(x.birthyear,11,31,23,59,59),"country":x.country,"birthyear":x.birthyear,"province":x.province }]});
            }); 
            
            console.log(beersfortimeline);
            
            
            
            
          
            console.log(beersformap);
             google.charts.setOnLoadCallback(drawMarkersMap);

            
            
            $(function() {
            $('#timeline').highcharts({

                chart: {
                    type: 'columnrange',
                    inverted: true
                },
                title: {
                    text: 'Timeline'
                },
                scrollbar: {
                    enabled: true
                },
                xAxis: {
                    categories: ['Beer']
                },
                yAxis: {
                    type: 'datetime',
                    title: {
                        text: 'Timespan'
                    }
                },
                plotOptions: {
                    columnrange: {
                        grouping: false
                    }
                },
                legend: {
                    enabled: true
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + ' - ' + this.series.name + this.series.birthyear+ '</b><br/>' + Highcharts.dateFormat('%e %B %H:%M', this.point.low) +
                            ' - ' + Highcharts.dateFormat('%B %e', this.point.high) +'<br/>';
                    }
                },

                series: beersfortimeline
            });
        });
            
            
            
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
            var data = google.visualization.arrayToDataTable(beersformap);

            var options = {
                region: '150',
                displayMode: 'markers',
                colorAxis: {
                    colors: ['green', 'blue']
                }
            };

            var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }
    
        
    }]);
