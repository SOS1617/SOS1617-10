angular
.module("SOS161710")
.controller("Poblation", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var countrycode = [];
    var population = [];
    var color = ["#50ADF5","#FF7965","#FFCB45","#6877e5","#6FB07F","B852F4","B0035F","33554F","00548F","FFFFF"];
    var colorPie = [];
    var contador = 0;
    
    
    
        
    $http.get("http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=daboca92").then(function(response){
        
                var res = response.data.geonames;
                
                        
                for(var i=0; i<res.length; i++){
                    countrycode.push(res[i].countrycode);
                    population.push(res[i].population);
                    colorPie.push(color[i]);
                }
                
                
                
                
        
                var myChart = {
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
              			values : [population[contador]],
              			text: countrycode[contador],
              		  backgroundColor: colorPie[contador],
              		}
              	]
              };
               
              zingchart.render({ 
              	id : 'myChart', 
              	data : myChart, 
              	height: 500, 
              	width: 725 
              });
    
});


    
}]);