angular
.module("SOS161710")
.controller("MotorcyclingsGraph", ["$http", function($http){
    console.log("Controller initialized");
    var motorByCountry = [];
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    
    $http
        .get(url + "/?" + apikey)
        .then(function(response) {
            var countries = new Set(response.data.map(function(x){
                return x.country;
            }));
            console.log(countries);
        });
        
        
        
    Highcharts.chart('container', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: 'Contents of Highsoft\'s weekly fruit delivery'
    },
    subtitle: {
        text: '3D donut in Highcharts'
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45
        }
    },
    series: [{
        name: 'Delivered amount',
        data: [
            ['Bananas', 8],
            ['Kiwi', 3],
            ['Mixed nuts', 1],
            ['Oranges', 6],
            ['Apples', 8],
            ['Pears', 4],
            ['Clementines', 4],
            ['Reddish (bag)', 1],
            ['Grapes (bunch)', 1]
        ]
    }]
});


}]);