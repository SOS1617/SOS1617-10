angular
    .module("SOS161710")
    .controller("InstaGraph", ["$http", "$scope", function($http, $scope) {


        $scope.login = function() {
            window.location.replace("http://sos1617-10.herokuapp.com/authorize_user");

        };

        var likes = [];
        var selflikes = [];
        var photos = [];
        var photototable = [];
        $http.get("/usermedia").then(function(response) {
            var likesnumber = 0;
            var selflikesnumber = 0;
            photos.push([0, response.data.length]);

            response.data.forEach((x) => {
                photototable.push({
                    image: x.images.thumbnail.url,
                    likes: x.likes.count,
                    self_liked: x.user_has_liked,
                    comments: x.comments.count
                })
                likesnumber += x.likes.count;
                if (x.user_has_liked == true) {
                    selflikesnumber++;
                }
            });
            likes.push([0, likesnumber]);
            selflikes.push([0, selflikesnumber]);
            $scope.photototable = photototable;
            document.getElementById("pleaselogin").className = "loader-hidden";


            var chart = new EJSC.Chart("instagramgraph", {
                show_legend: true
            });
            var stack = chart.addSeries(new EJSC.StackedBarSeries({
                intervalOffset: 1
            }));

            stack.addSeries(new EJSC.BarSeries(
                new EJSC.ArrayDataHandler(likes)
            ));
            stack.addSeries(new EJSC.BarSeries(
                new EJSC.ArrayDataHandler(photos)
            ));

            stack.addSeries(new EJSC.BarSeries(
                new EJSC.ArrayDataHandler(selflikes)
            ));
            
        });








    }]);
