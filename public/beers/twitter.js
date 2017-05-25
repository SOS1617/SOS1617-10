angular
    .module("SOS161710")
    .controller("TwitterInt", ["$http", function($http) {

        var datatograph = [];
        datatograph.push(['Name', 'Number of Tweets', 'Positive+', 'Positive', 'None', 'Negative', 'Negative+', 'Ironic']);


        $http.get("/api/v2/beers-stats/Spain/?apikey=jesusguerre").then(function(response) {
            var beers = response.data;

            beers.forEach((x) => {
                $http.get("/api/v2/twitsearch/" + x.name.toLocaleLowerCase()).then(function(response) {
                    var tweets = [];
                    var tweetsize = response.data.statuses.length;
                    var pplus = 0;
                    var p = 0;
                    var none = 0;
                    var n = 0;
                    var nplus = 0;
                    var ironic = 0;
                    response.data.statuses.forEach((x) => {
                        tweets.push({
                            "message": x.text
                        });
                    });
                    console.log(tweets);
                    tweets.forEach((x) => {
                        var result;
                        $http.post("/api/v2/sentimentAnalisis", x).then(function(response) {
                            response.on('data', function(chunk) {
                                result += chunk;
                            });
                            response.on('end', function() {
                                console.log('BODY: ' + result);
                            });


                        });
                        console.log(result);
                        switch (result.tag) {
                            case 'P+':
                                pplus++;
                                break;
                            case 'P':
                                p++;
                                break;
                            case 'NONE':
                                none++;
                                break;
                            case 'N':
                                n++;
                                break;
                            default:
                                nplus++;
                        }
                        if (result.irony == "IRONIC") {
                            ironic++;
                        }


                    });

                    datatograph.push([x, tweetsize, pplus, p, none, n, nplus, ironic]);


                });
            });

            google.charts.load('current', {
                'packages': ['bar']
            });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var data = google.visualization.arrayToDataTable(datatograph);

                var options = {
                    chart: {
                        title: 'Company Performance',
                        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                    },
                    bars: 'vertical',
                    vAxis: {
                        format: 'decimal'
                    },
                    height: 400,
                    colors: ['#1b9e77', '#d95f02', '#7570b3']
                };

                var chart = new google.charts.Bar(document.getElementById('chart_div'));

                chart.draw(data, google.charts.Bar.convertOptions(options));

                var btns = document.getElementById('btn-group');

                btns.onclick = function(e) {

                    if (e.target.tagName === 'BUTTON') {
                        options.vAxis.format = e.target.id === 'none' ? '' : e.target.id;
                        chart.draw(data, google.charts.Bar.convertOptions(options));
                    }
                }
            }







        });








    }]);
