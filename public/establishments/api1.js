angular
    .module("SOS161710")
    .controller("IntegrationAPI1EstablishmentsGraph", ["$http", function($http) {
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v2/establishments";
        var apikey = "apikey=nurtrioje";
        
        var countries = ['Germany', 'France', 'Spain'];
        var establishments = [];
        var salaries = [];
        var establishmentsData = [];
        var salariesData = [];
        
        $http.get("http://sos1617-10.herokuapp.com/api/v2/salariesproxy").then(function(response){
            salariesData = response.data;
        });
        
        $http.get(url + "/?" + apikey).then(function(response) {
            establishmentsData = response.data;
            
            countries.forEach((country) => {
                
                establishmentsData.forEach((d) => {
                    if(d.country == country) {
                        establishments.push(d.number);
                    }
                });
                
                salariesData.forEach((d)=>{
                    if(d.country == country) {
                        salaries.push(d.averageSalary)
                    }
                });
            });

            Highcharts.chart('api1-establishments', {
                chart: {
                    type: 'area',
                    spacingBottom: 30
                },
                title: {
                    text: 'Salaries (G07) - Establishments Integration'
                },
                subtitle: {
                    text: '* Jane\'s banana consumption is unknown',
                    floating: true,
                    align: 'right',
                    verticalAlign: 'bottom',
                    y: 15
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 150,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                xAxis: {
                    categories: countries
                },
                yAxis: {
                    title: {
                        text: 'Y-Axis'
                    },
                    labels: {
                        formatter: function() {
                            return this.value;
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.series.name + '</b><br/>' +
                            this.x + ': ' + this.y;
                    }
                },
                plotOptions: {
                    area: {
                        fillOpacity: 0.5
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Establishments',
                    data: establishments
                }, {
                    name: 'Salaries',
                    data: salaries
                }]
                
                
                
            });
        });
    }]);
