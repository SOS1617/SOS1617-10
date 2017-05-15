angular
    .module("SOS161710")
    .controller("IntegrationAPI2EstablishmentsGraph", ["$http", function($http) {
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v2/establishments";
        var apikey = "apikey=nurtrioje";
        
        var countries = ["Spain", "Germany", "France", "Greece"];
        var establishments = [];
        var investments = [];
        var investmentsData;
        var establishmentsData;
        
        $http.get("http://sos1617-03.herokuapp.com/api/v1/investmentseducation/?apikey=apisupersecreta").then(function(response){
            investmentsData = response.data;
            
            countries.forEach((country) => {
                var exist = false;
                investmentsData.forEach((d) => {
                    if(d.country.toLowerCase() == country.toLowerCase() && exist == false){
                        investments.push(Number(d.inveducation)*1000000);
                        exist = true;
                    }
                });
                if(exist == false) {
                    investments.push(null);
                }
            });
            
        });
        
        $http.get(url + "/?" + apikey).then(function(response) {
            establishmentsData = response.data;
            
            countries.forEach((country) => {
                var exist = false;
                establishmentsData.forEach((d) => {
                    if(d.country.toLowerCase() == country.toLowerCase() && exist == false){
                        establishments.push(d.nights);
                        exist = true;
                    }
                });
                if(exist == false){
                    establishments.push(null);
                }
            });
            
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
                    data: establishments
                }, {
                    name: 'Investments in Education',
                    data: investments
                }]

            });

        });
    }]);
