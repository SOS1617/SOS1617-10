angular
    .module("SOS161710")
    .controller("TicsEstablishments", ["$http", function($http) {

        var countriesEstablishments = [];
        var numberEstablishments = [];

        var countriesTics = [];
        var numberTics = [];

        $http.get("http://sos1617-10.herokuapp.com/api/v2/establishments?apikey=nurtrioje").then(function(response) {

            response.data.forEach((x) => {
                countriesEstablishments.push(x.country);
                numberEstablishments.push(x.number/1000);
            });

        });

        $http.get("http://sos1617-09.herokuapp.com/api/v2/ticsathome-stats?apikey=ticsathomeLuis").then(function(response) {

            response.data.forEach((x) => {
                countriesTics.push(x.country);
                numberTics.push(x.tablet);
            });

            var trace1 = {
                x: countriesEstablishments,
                y: numberEstablishments,
                name: 'Number of establishments per 1000',
                mode: 'lines',
                type: 'scatter'
            };

            var trace2 = {
                x: countriesTics,
                y: numberTics,
                name: 'Number of tablets at home',
                mode: 'lines',
                type: 'scatter'
            };

            var data = [trace1, trace2];

            Plotly.newPlot('TicsEstablishmentsPlotly', data);

        });

    }]);
