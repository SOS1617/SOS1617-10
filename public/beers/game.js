angular
    .module("SOS161710")
    .controller("Games", ["$http", function($http) {
        var data = [];

        $http.get("http://sos1617-10.herokuapp.com/api/v2/beers-stats?apikey=jesusguerre").then(function(response) {
            var aux = response.data;
            aux.forEach((x) => {
                data.push({name:x.name,date:String(x.birthyear)+"-01-01"});

            });
        });
        $http.get("http://sos1617-10.herokuapp.com/api/v2/games?apikey=jesusguerre").then(function(response) {
            var aux = response.data;
            aux.forEach((x) => {
                data.push({name:String(x.game),date:String(x.y)+"-01-01"});

            });
            /* data.sort(function(a, b) {
                 return a[1] - b[1];
             });*/
            console.log(data);
            
            TimeKnots.draw("#timeline1", data, {
                dateFormat: "%B %Y",
                color: "#696",
                width: 500,
                showLabels: true,
                labelFormat: "%Y"
            });
        });



    }]);
