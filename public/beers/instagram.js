angular
    .module("SOS161710")
    .controller("InstaGraph",["$http","$scope","$rootScope", function($http,$scope,$rootScope){
        var logged=false;
         if ($rootScope.data) {
            logged = $rootScope.data.logstatus;
            
        }
        
        $scope.login= function (){
          window.location.replace("http://sos1617-10.herokuapp.com/authorize_user");  
          $rootScope.data={logstatus:true};
        };
        if(logged==true){
            console.log("Congratulations!! You have logged in.");
        }
        
        
    }]);