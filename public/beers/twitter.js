angular
    .module("SOS161710")
    .controller("TwitterInt", ["$http", function($http) {

        var datatograph = [];
        datatograph.push(['Name', 'Number of Tweets', 'Positive+', 'Positive', 'None', 'Negative', 'Negative+', 'Ironic']);


        $http.get("/api/v2/beers-stats/Spain/?apikey=jesusguerre").then(function(response) {
            var beers = response.data;
            var beerCont = 0;
            beers.forEach((x) => {
                $http.get("/api/v2/twitsearch/" + x.name.toLocaleLowerCase()).then(function(response) {
                    var tweets = [];
                    response.data.statuses.forEach((z) => {
                        tweets.push({
                            "message": z.text
                        });
                    });
                    console.log(tweets);
                    var tweetsize = response.data.statuses.length;
                    var cont = 0;
                    var pplus = 0;
                    var p = 0;
                    var none = 0;
                    var n = 0;
                    var nplus = 0;
                    var ironic = 0;
                    tweets.forEach((y) => {


                        $http.post("/api/v2/sentimentAnalisis", y).then(function(response) {
                            console.log(response.data.tag);
                            switch (response.data.tag) {
                                case 'P+':
                                    pplus++;
                                    cont++;
                                    break;
                                case 'P':
                                    p++;
                                    cont++;
                                    break;
                                case "NONE":
                                    none++;
                                    cont++;
                                    break;
                                case 'N':
                                    n++;
                                    cont++;
                                    break;
                                default:
                                    nplus++;
                                    cont++;
                            }
                            if (response.data.irony == "IRONIC") {
                                ironic++;
                                cont++;
                            }
                            
                                
                           
                            
                            if (cont >= tweetsize ) {
                                console.log(tweetsize);
                                console.log(datatograph);
                                datatograph.push([x.name, tweetsize, pplus, p, none, n, nplus, ironic]);
                                beerCont++;
                            }
                            if (beerCont >= beers.length) {
                                show();
                            }

                        });



                    });




                });
            });

            function show() {
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
                    };
                }

            }





        });








    }]);
