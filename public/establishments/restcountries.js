angular
    .module("SOS161710")
    .controller("RestCountries", ["$http", function($http) {

        var restcountriesData = [];
        restcountriesData.push(['Location', 'Region', 'Area', 'Population'],
            ['Global', null, 0, 0], 
            ['Americas', 'Global', 0, 0],
            ['Europe', 'Global', 0, 0], 
            ['Asia', 'Global', 0, 0],
            ['Oceania', 'Global', 0, 0],
            ['Africa', 'Global', 0, 0],
            ['Polar', 'Global', 0, 0]);

        $http.get("http://sos1617-10.herokuapp.com/api/v2/restcountries").then(function(response) {

            var aux = response.data;
            aux.forEach((d) => {
                if(!d.region){
                    restcountriesData.push([d.name, "Global", 0, 0]);
                } else {
                    restcountriesData.push([d.name, d.region, Number(d.area), Number(d.population)]);
                }
                
            });
            console.log(restcountriesData);
            google.charts.load('current', {
                'packages': ['treemap']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(restcountriesData);

                tree = new google.visualization.TreeMap(document.getElementById('chart_div'));

                tree.draw(data, {
                    minColor: '#0d0',
                    midColor: '#ddd',
                    maxColor: '#f00',
                    headerHeight: 15,
                    fontColor: 'black',
                    showScale: true
                });

            }
        });
    }]);
