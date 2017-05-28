angular
    .module("SOS161710")
    .controller("InstaGraph",["$http","$scope", function($http,$scope){
        var logged = false;
        
        $scope.login= function (){
          window.location.replace("http://sos1617-10.herokuapp.com/authorize_user");  
          logged=true;
        };
        if(logged==true){
            console.log("Congratulations!! You have logged in.");
        }
        
        
    }]);