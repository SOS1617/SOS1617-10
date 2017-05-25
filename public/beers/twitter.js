angular
    .module("SOS161710")
    .controller("TwitterInt", ["$http", function($http) {
        console.log("Initialized");
        google.charts.load('current', {
            'packages': ['bar']
        });
        google.charts.setOnLoadCallback(drawStuff);




        var data = google.visualization.arrayToDataTable([
            ['Genre', 'Fantasy & Sci Fi', 'Romance', 'Mystery/Crime', 'General',
                'Western', 'Literature', {
                    role: 'annotation'
                }
            ],
            ['2010', 10, 24, 20, 32, 18, 5, ''],
            ['2020', 16, 22, 23, 30, 16, 9, ''],
            ['2030', 28, 19, 29, 30, 12, 13, '']
        ]);

        var options = {
            width: 600,
            height: 400,
            legend: {
                position: 'top',
                maxLines: 3
            },
            bar: {
                groupWidth: '75%'
            },
            isStacked: true,
        };
        
        var chart = new google.charts.Bar(document.getElementById('top_x_div'));
        chart.draw(data, google.charts.Bar.convertOptions(options));

    }]);
