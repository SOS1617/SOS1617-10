angular
.module("SOS161710")
.controller("IntegrationAPI1MotorcyclingsGraph", ["$http", function($http){
    console.log("Controller initialized");
    var url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    var apikey = "apikey=davbotcab";
    var salaryData = {};
    var salaryDataSMI = {};
    var country = [];
    var smiyear = [];
    var smiyearvariation = [];
        
    $http.get("https://sos1617-02.herokuapp.com/api/v1/smi-stats?apikey=rXD8D2b1vP").then(function(response){
        
        salaryData = response.data;
        salaryDataSMI = salaryData;
                
        for(var i=0; i<response.data.length; i++){
            country.push(salaryDataSMI[i].country);
            smiyear.push(Number(salaryDataSMI[i]["smi-year"]));
            smiyearvariation.push(Number(salaryDataSMI[i]["smi-year-variation"]));
        }
        
        
        
        
        Highcharts.chart('myGraph3d', {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: 'Number of Pilots Champions by Country'
    },
    subtitle: {
        text: '3D donut in Highcharts'
    },
    plotOptions: {
        pie: {
            innerSize: 30,
            depth: 45
        }
    },
    series: [{
        name: 'smiyear',
        data: smiyear
        
        }]
    });    
        
});    

    
}]);