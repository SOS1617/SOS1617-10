angular
    .module("SOS161710")
    .controller("IntegrationAPI2EstablishmentsGraph", ["$http", function($http) {
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v2/establishments";
        var apikey = "apikey=nurtrioje";
        
        var countries = ["Spain", "Germany", "France", "Greece"];
        
        $http.get("http://sos1617-10.herokuapp.com/api/v2/salariesproxy").then(function(response){
            
        });
        
        $http.get(url + "/?" + apikey).then(function(response) {
            Highcharts.chart('api2-establishments', {

                title: {
                    text: 'Investments in Education (G03) - Establishments Integration'
                },
                xAxis: {
                    categories: countries
                },

                yAxis: {
                    title: {
                        text: 'Nights spent on Establishments - Investments on Education'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

                series: [{
                    name: 'Nights in Establishments',
                    data: [43934, 52503, 57177, 69658]
                }, {
                    name: 'Investments in Education',
                    data: [24916, 24064, 29742, 29851]
                }]

            });

        });
    }]);
