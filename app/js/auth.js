var pimsAuth = angular.module('PimsAuth', ['ngCookies']);
pimsAuth.controller('AuthController', ['$scope','$http',  function ($scope, $http) {

    function _authenticate(auth_data) {
        return $http.post('/auth/authenticate', auth_data)
    }

    $scope.init = function () {
        console.log("Init");
    };



    $scope.authenticate = function (username, pass) {
            var auth_data = {
                login: username,
                pass: pass
            };
        _authenticate(auth_data).then(function (done) {
            console.log("Success");
        }, function (error) {
            $scope.auth = {
                flag: true,
                body: "Your Loing or Password Are Not Correct"
            }
        })
    };


}]);