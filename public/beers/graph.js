angular
    .module("SOS161710")
    .controller("BeersGraphs", ["$http", function($http) {
        console.log("Controller initialized");
         var beersbycountry = [];
         var url="http://sos1617-10.herokuapp.com/api/v2/beers-stats";
         var apikey = "jesusguerre";
        $http.get(url+"/?"+apikey).then(function (response){
            var countries = new Set ([response.data.map( function (x) {return x.country})]);
            for (var country in countries){
                beersbycountry.push(getFromApi(country));
            }
            
        });

function getFromApi (country){
    var response;
     $http.get(url+"/"+country+"?"+apikey).then(function (response) {
        response= [country,response.data.length];
    });
    return response;
}


var chart = c3.generate({
   
    
    
    data: {
        columns: [
           beersbycountry
        ],
        type : 'pie',
       
    }
});



    }]);
