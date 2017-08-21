pimsApp.controller('AttributeSetCtrl', function($scope, $routeParams, $http) {
    $scope.hello = "test";
    console.log("AttributeSetCtrl")
    $scope.init = function () {
        $http.get()
    }
})