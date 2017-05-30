angular
.module("SOS161710")
.controller("Poblation", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var poblationData = [];
    poblationData.push(['Name', 'Number']);
    
    
        
    $http.get("http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo").then(function(response){
        
                var res = response.data.geonames;
                        
                for(var i=0; i<res.length; i++){
                    poblationData.push([res[i].countrycode, res[i].population]);
                }
                
        
        
                var myConfig = {
               	type: "pie", 
               	backgroundColor: "#2B313B",
               	plot: {
               	  borderColor: "#2B313B",
               	  borderWidth: 5,
               	  // slice: 90,
               	  valueBox: {
               	    placement: 'out',
               	    text: '%t\n%npv%',
               	    fontFamily: "Open Sans"
               	  },
               	  tooltip:{
               	    fontSize: '18',
               	    fontFamily: "Open Sans",
               	    padding: "5 10",
               	    text: "%npv%"
               	  },
               	  animation:{
                    effect: 2, 
                    method: 5,
                    speed: 500,
                    sequence: 1
                  }
               	},
               	source: {
               	  text: 'gs.statcounter.com',
               	  fontColor: "#8e99a9",
               	  fontFamily: "Open Sans"
               	},
               	title: {
               	  fontColor: "#fff",
               	  text: 'Global Browser Usage',
               	  align: "left",
               	  offsetX: 10,
               	  fontFamily: "Open Sans",
               	  fontSize: 25
               	},
               	subtitle: {
               	  offsetX: 10,
               	  offsetY: 10,
               	  fontColor: "#8e99a9",
               	  fontFamily: "Open Sans",
               	  fontSize: "16",
               	  text: 'May 2016',
               	  align: "left"
               	},
               	plotarea: {
               	  margin: "20 0 0 0"  
               	},
              	series : [
              		{
              			values : [11.38],
              			text: "Internet Explorer",
              		  backgroundColor: '#50ADF5',
              		},
              		{
              		  values: [56.94],
              		  text: "Chrome",
              		  backgroundColor: '#FF7965'
              		},
              		{
              		  values: [14.52],
              		  text: 'Firefox',
              		  backgroundColor: '#FFCB45'
              		},
              		{
              		  text: 'Safari',
              		  values: [9.69],
              		  backgroundColor: '#6877e5'
              		},
              		{
              		  text: 'Other',
              		  values: [7.48],
              		  backgroundColor: '#6FB07F'
              		}
              	]
              };
               
              zingchart.render({ 
              	id : 'myChart', 
              	data : myConfig, 
              	height: 500, 
              	width: 725 
              });
    
});


    
}]);