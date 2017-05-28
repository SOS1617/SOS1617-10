angular
    .module("SOS161710")
    .controller("InstaGraph", ["$http", "$scope", function($http, $scope) {
        

        $scope.login = function() {
            window.location.replace("http://sos1617-10.herokuapp.com/authorize_user");

        };
        
        var likes=new Array();
        var selflikes=new Array();
        $http.get("/usermedia").then(function(response){
            var likesnumber=0;
            var selflikesnumber=0;
            response.data.forEach( (x)=>{
               likesnumber+=x.likes.count;
               if( x.user_has_liked==true){
                   selflikesnumber++;
               }
            });
            likes.push(likesnumber);
            selflikes.push(selflikesnumber);
            Plotly.newPlot('myDiv', data, layout);
        });



        var trace1 = {
            x: ['your_account'],
            y: likes,
            name: 'likes',
            type: 'bar'
        };

        var trace2 = {
            x: ['your_account'],
            y: selflikes,
            name: 'ownlikes',
            type: 'bar'
        };

        var data = [trace1, trace2];

        var layout = {
            barmode: 'stack'
        };

        


    }]);
