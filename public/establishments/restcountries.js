angular
    .module("SOS161710")
    .controller("RestCountries", ["$http", function($http) {
        
        var restcountriesData = [];
        restcountriesData.push(['Location', 'Region', 'Population', 'Area']);

        $http.get("http://sos1617-10.herokuapp.com/api/v2/restcountries").then(function(response) {
            
            var aux = response.data;
            aux.forEach((d) => {
               restcountriesData.push([d.name, d.region, d.population, d.area]);
            });
            
            google.charts.load('current', {
                'packages': ['treemap']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(restcountriesData);

                tree = new google.visualization.TreeMap(document.getElementById('chart_div'));

                tree.draw(data, {
                    minColor: '#f00',
                    midColor: '#ddd',
                    maxColor: '#0d0',
                    headerHeight: 15,
                    fontColor: 'black',
                    showScale: true
                });

            }
        });
    }]);
