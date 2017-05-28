angular
    .module("SOS161710")
    .controller("InstaGraph",["$http","$scope", function($http,$scope){
        
        $http.get("/authorize_user");
        
        
    }]);