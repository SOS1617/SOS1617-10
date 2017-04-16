angular
    .module("EstablishmentsManagerApp")
    .controller("ListCtrl", ["$scope", "$http", function($scope, $http) { //inyección de dependencia
        console.log("Controller initialized");
        var url = "http://sos1617-10.herokuapp.com/api/v1";
        var apikey = "";
        var from = "";
        var to = "";
        var limit = "";
        var offset = "";

        function refresh() {
            $http
                .get(url + "/establishments?" + apikey + from + to + limit + offset)
                .then(function(response) { //promesas
                    $scope.establishments = response.data;
                    console.log("carga establishments");
                }, function(response) {
                    console.log("no carga");
                });
        }

        $scope.addEstablishment = function() {
            $scope.newEstablishment.year = Number($scope.newEstablishment.year);
            $scope.newEstablishment.number = Number($scope.newEstablishment.number);
            $scope.newEstablishment.beds = Number($scope.newEstablishment.beds);
            $scope.newEstablishment.nights = Number($scope.newEstablishment.nights);
            $http
                .post(url + "/establishments?" + apikey, $scope.newEstablishment)
                .then(function(response) {
                    console.log("Establishment added");
                    refresh();
                });
        };

        $scope.deleteEstablishment = function(country, year) {
            $http
                .delete(url + "/establishments/" + country + "/" + year + "?" + apikey)
                .then(function(response) {
                    console.log("Establishment deleted");
                    refresh();
                });
        };

        $scope.deleteAllEstablishments = function() {
            $http
                .delete(url + "/establishments?" + apikey)
                .then(function(response) {
                    console.log("All establishments deleted");
                    refresh();
                });
        };

        $scope.putEstablishment = function(country, year) {
            $http
                .put(url + "/establishments/" + country + "/" + Number(year) + "?" + apikey, $scope.Establishment)
                .then(function(response) {
                    $scope.responseData = response.data;
                    console.log("Establishment updated");
                    refresh();
                });
        };

        $scope.fillFields = function(country, year) {
            $scope.Establishment = $http
                .get(url + "/establishments/" + country + "/" + year + "?" + apikey)
                .then(function(response) {
                    $scope.Establishment = response.data[0];
                    delete $scope.Establishment["_id"];
                    console.log($scope.Establishment);
                })[0];
        };

        $scope.clearResponseData = function() {
            $scope.responseData = "";
        };
        
        $scope.setApikey = function() {
            apikey = "apikey=" + $scope.Apikey;
            refresh();
        };
        
        $scope.search = function(fromYear,toYear){
            if (fromYear) from = "&from=" + Number(fromYear);
            else fromYear="";
            if (toYear) to = "&to=" + Number(toYear);
            else toYear="";
            refresh();
        };
        
        $scope.paginate = function(Limit,Offset){
            if(Limit) limit = "&limit=" + Number(Limit);
            else limit="";
            if(Offset) offset = "&offset=" + Number(Offset);
            else offset="";
            refresh();
        };

        refresh();

    }]);
