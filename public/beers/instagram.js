angular
    .module("SOS161710")
    .controller("InstaGraph", ["$http", "$scope", function($http, $scope) {
        

        $scope.login = function() {
            window.location.replace("http://sos1617-10.herokuapp.com/authorize_user");

        };
        
        var likes=[];
        var selflikes=[];
        var photos=[];
        var photototable=[];
        $http.get("/usermedia").then(function(response){
            var likesnumber=0;
            var selflikesnumber=0;
            photos.push(response.data.length);
            
            response.data.forEach( (x)=>{
                photototable.push({image:x.images.thumbnail.url,likes:x.likes.count,self_liked:x.user_has_liked,comments:x.comments.count})
               likesnumber+=x.likes.count;
               if( x.user_has_liked==true){
                   selflikesnumber++;
               }
            });
            likes.push(likesnumber);
            selflikes.push(selflikesnumber);
            $scope.photototable=photototable;
            Plotly.newPlot('instagramgraph', data, layout);
            document.getElementById("pleaselogin").className="loader-hidden";
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
        var trace3 = {
            x: ['your_account'],
            y: photos,
            name: '#Photos',
            type: 'bar'
        };

        var data = [trace1, trace2,trace3];

        var layout = {
            barmode: 'stack'
        };

        


    }]);
