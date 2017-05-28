angular
    .module("SOS161710")
    .controller("InstaGraph",["$http","$scope", function($http,$scope){
       
        
        $scope.login= function (){
          window.location.replace("http://sos1617-10.herokuapp.com/authorize_user");  
         
        };
      
        
        
    }]);