angular
.module("SOS161710")
.controller("MotorcyclingsGraphs", ["$http","$scope", function($http,$scope){
    console.log("Controller initialized");
    $scope.url = "http://sos1617-10.herokuapp.com/api/v2/motorcycling-stats";
    $scope.apikey = "apikey=davbotcab";
    $scope.data = {};
    $scope.country = [];
    $scope.pilot = [];
    $scope.team = [];
    $scope.year = [];
        
    $http.get($scope.url + "/?" + $scope.apikey).then(function(response){
        

        $scope.data = response.data;
            
        for(var i=0; i<response.data.length; i++){
            $scope.country.push($scope.data[i].country);
            $scope.pilot.push($scope.data[i].pilot);
            $scope.team.push($scope.data[i].team);
            $scope.year.push(Number($scope.data[i].year));
            
            console.log($scope.data[i].country);
        }
    });    
            
        
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
            innerSize: 300,
            depth: 75
        }
    },
    series: [{
        name: 'Delivered amount',
        data: [
            [$scope.country, $scope.pilot],
        ]
    }]
});


}]);