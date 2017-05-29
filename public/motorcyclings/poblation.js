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
    var motorcyclingsVis = [];
    
    $http.get(url + "/?" + apikey).then(function(response){
              var res = response.data;
                res.forEach((x) => {
                    poblationData.push([x.pilot, 2017-x.year]);
                });
            var cont = 0;
            response.data.forEach((x) => {
                motorcyclingsVis.push({
                    id:cont,
                    content:x.pilot,
                    start:x.year+"-01-01",
                    end:x.year+"-12-31"
                });
                cont++;
            });
        
        
    });
    
        
    $http.get("http://geodata.grid.unep.ch/api/countries/DE/variables/1").then(function(response){
        
                poblationData = response.data;
                        
                for(var i=0; i<response.data.length; i++){
                    name.push(poblationData[i].name);
                    population.push(Number(poblationData[i].population));
                }
                
        
        
                var names = ['centripetal', 'chordal', 'uniform', 'disabled'];
                var groups = new vis.DataSet();
                groups.add({
                    id: 0,
                    content: names[0],
                    options: {
                        drawPoints: false,
                        interpolation: {
                            parametrization: 'centripetal'
                        }
                    }});
            
                groups.add({
                    id: 1,
                    content: names[1],
                    options: {
                        drawPoints: false,
                        interpolation: {
                            parametrization: 'chordal'
                        }
                    }});
            
                groups.add({
                    id: 2,
                    content: names[2],
                    options: {
                        drawPoints: false,
                        interpolation: {
                            parametrization: 'uniform'
                        }
                    }
                });
            
                groups.add({
                    id: 3,
                    content: names[3],
                    options: {
                        drawPoints: { style: 'circle' },
                        interpolation: false
                    }});
            
                var container = document.getElementById('visualization');
                var dataset = new vis.DataSet();
                for (var i = 0; i < names.length; i++) {
                    dataset.add( [
                        {x: '2014-06-12', y: 0 , group: i},
                        {x: '2014-06-13', y: 40, group: i},
                        {x: '2014-06-14', y: 10, group: i},
                        {x: '2014-06-15', y: 15, group: i},
                        {x: '2014-06-15', y: 30, group: i},
                        {x: '2014-06-17', y: 10, group: i},
                        {x: '2014-06-18', y: 15, group: i},
                        {x: '2014-06-19', y: 52, group: i},
                        {x: '2014-06-20', y: 10, group: i},
                        {x: '2014-06-21', y: 20, group: i}
                    ]);
                }
            
                var options = {
                    drawPoints: false,
                    dataAxis: {visible: false},
                    legend: true,
                    start: '2014-06-11',
                    end: '2014-06-22'
                };
                var graph2d = new vis.Graph2d(container, dataset, groups, options);

    
});

    function getFromCountry(country, data) {
        var response;
        response = [country, data.filter((x) => {
            return x.country == country;
        }).length];
        return response;
    }


    
}]);