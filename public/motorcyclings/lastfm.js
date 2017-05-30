angular
.module("SOS161710")
.controller("Lastfm", ["$http","scope", function($http,$scope){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var name = [];
    var playcount = [];
    
    
    $http.get("http://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=d9c117e532f10f87c74f225f43a7f843&user=rj&format=json").then(function(response){
        
        var res = response.data.artists.artist;
                
        for(var i=0; i<res.length; i++){
            name.push(res[i].name);
            playcount.push(res[i].playcount);
        }
        
        
            //ZingChart
            var myChart = {
                "type": "line",
                
                "backgroundColor":'#FFFFFF',
                "title": {
                    "text": "Brad Pitt movies analytics",
                    "fontColor":"#E3E3E5",
                    "font-size": "24px",
                    "adjust-layout": true
                },
                "plotarea": {
                    "margin": "dynamic 45 60 dynamic",
                },
                
                "legend": {
                    "layout": "float",
                    "background-color": "none",
                    "border-width": 0,
                    "shadow": 0,
                    "align": "center",
                    "adjust-layout": true,
                "item": {
                    "padding": 7,
                    "marginRight": 17,
                    "cursor": "hand"
                }
                },
                
                "scale-x": {
                    "label": {
                        "text": "Title",
                        "fontColor":"#E3E3E5",

                    },
                    "labels": 
                        name
                    
                },
                "scale-y": {
                    "min-value": "0:2020",
                    "label": {
                        "text": "Ids",
                        "fontColor":"#E3E3E5",

                    },
                    
                },
                
                "crosshair-x": {
                    "line-color": "#efefef",
                    "plot-label": {
                    "border-radius": "5px",
                    "border-width": "1px",
                    "border-color": "#f6f7f8",
                    "padding": "10px",
                    "font-weight": "bold"
                },
                "scale-label": {
                    "font-color": "#000",
                    "background-color": "#f6f7f8",
                    "border-radius": "5px"
                }
            },
                
                "tooltip": {
                    "visible": false
                },
                
                "plot": {
                    "highlight": true,
                    "tooltip-text": "%t views: %v<br>%k",
                    "shadow": 0,
                    "line-width": "2px",
                    "marker": {
                    "type": "circle",
                    "size": 3
                },
                "highlight-state": {
                "line-width": 3
                },
                "animation": {
                    "effect": 1,
                    "sequence": 2,
                    "speed": 100,
                }
                },
                
                "series": [
                {
                    "values": playcount,
                    "text": "Title",
                    "line-color": "#007790",
                    "legend-item":{
                      "background-color": "#007790",
                      "borderRadius":5,
                      "font-color":"white"
                    },
                    "legend-marker": {
                        "visible":false
                    },
                    "marker": {
                        "background-color": "#007790",
                        "border-width": 1,
                        "shadow": 0,
                        "border-color": "#69dbf1"
                    },
                    "highlight-marker":{
                      "size":6,
                      "background-color": "#007790",
                    }
                }
            ]
            };

            zingchart.render({
                id: 'chart',
                data: myChart,
                height: '100%',
                width: '95%'
            });
            
});
    
}]);