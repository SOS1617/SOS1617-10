angular
    .module("SOS161710")
    .controller("BeersGraphs", ["$http", function() {
        console.log("Controller initialized");
        var chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 50, 20, 10, 40, 15, 25]
                ]
            }
        });




    }]);
