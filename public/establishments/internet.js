angular
    .module("SOS161710")
    .controller("Internet-Establishments", ["$http", function($http) {

        var countriesEstablishments = [];
        var numberEstablishments = [];

        var countriesInternet = [];
        var numberInternet = [];

        $http.get("http://sos1617-10.herokuapp.com/api/v2/establishments?apikey=nurtrioje").then(function(response) {

            response.data.forEach((x) => {
                countriesEstablishments.push(x.country);
                numberEstablishments.push(x.number);
            });

        });

        $http.get("http://sos1617-09.herokuapp.com/api/v2/internetandphones-stats?apikey=internetstats").then(function(response) {

            response.data.forEach((x) => {
                countriesInternet.push(x.country);
                numberInternet.push(x.usageinternet);
            });


            var trace1 = {
                x: countriesEstablishments,
                y: numberEstablishments,
                name: 'Number of establishments',
                type: 'bar'
            };

            var trace2 = {
                x: countriesInternet,
                y: numberInternet,
                name: 'Usage of Internet',
                type: 'bar'
            };

            var data = [trace1, trace2];

            var layout = {
                barmode: 'group'
            };

            Plotly.newPlot('InternetEstablishmentsPlotly', data, layout);
        });

    }]);
