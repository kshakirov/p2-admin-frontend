var pimsAuth = angular.module('PimsAuth', ['ngCookies']);
pimsAuth.controller('AuthController', ['$scope','$http', '$cookies',
    '$window',    function ($scope, $http, $cookies, $window) {

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
        _authenticate(auth_data).then(function (response) {
            console.log(response.data.token);
            $cookies.put('token', response.data.token);
            $window.location.href = '/';
        }, function (error) {
            $scope.auth = {
                flag: true,
                body: "Your Login and/or Password Are Not Correct"
            }
        })
    };


}]);