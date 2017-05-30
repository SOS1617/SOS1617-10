angular
.module("SOS161710")
.controller("Lastfm", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var lastfmData = [];
    lastfmData.push(['Name', 'Number']);
    
    
    $http.get("http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=d9c117e532f10f87c74f225f43a7f843&user=rj&format=json").then(function(response){
        
        var res = response.data.artists.artist;
                
        for(var i=0; i<res.length; i++){
            lastfmData.push([res[i].name, res[i].playcount]);
        }
        
    var chartData = {
      type: "bar",  // Specify your chart type here.
      title: {
        text: "My First Chart" // Adds a title to your chart
      },
      legend: {}, // Creates an interactive legend
      series: lastfmData
    };
    zingchart.render({ // Render Method[3]
      id: "chartDiv",
      data: chartData,
      height: 400,
      width: 600
    });
            
            
});
    
}]);