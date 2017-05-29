angular
.module("SOS161710")
.controller("Poblation", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var poblationData = [];
    poblationData.push(['Name', 'Number']);
    var country = ["United Kingdom", "Italy", "Spain"];
    var population = [];
    var name = [];
    
    $http.get(url + "/?" + apikey).then(function(response){
              var res = response.data;
                res.forEach((x) => {
                    poblationData.push([x.pilot, 2017-x.year]);
                });
            });
    
        
    $http.get("http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo").then(function(response){
        
                poblationData = response.data;
                        
                for(var i=0; i<response.data.length; i++){
                    name.push(poblationData[i].name);
                    population.push(Number(poblationData[i].population));
                }
                
        
        
              var container = document.getElementById('visualization');
                var items = [
                    {x: '2014-06-11', y: 10},
                    {x: '2014-06-12', y: 25},
                    {x: '2014-06-13', y: 30},
                    {x: '2014-06-14', y: 10},
                    {x: '2014-06-15', y: 15},
                    {x: '2014-06-16', y: 30}
                  ];
                
                  var dataset = new vis.DataSet(items);
                  var options = {
                    start: '2014-06-10',
                    end: '2014-06-18'
                  };
                  var graph2d = new vis.Graph2d(container, dataset, options);

    
});

    function getFromCountry(country, data) {
        var response;
        response = [country, data.filter((x) => {
            return x.country == country;
        }).length];
        return response;
    }


    
}]);