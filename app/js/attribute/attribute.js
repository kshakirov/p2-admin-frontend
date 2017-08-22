pimsApp.controller('AttributeCtrl', function ($scope, $route, $routeParams,
                                              $location,
                                              $http,
                                              $rootScope,
                                              AttributeModel,
                                              NgTableParams) {
    console.log("PimsApp AttributeCtrl");
    $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL"]
    $scope.init = function () {
        AttributeModel.findOne($routeParams.uuid).then(function (attribute) {
            console.log(attribute);
            $scope.attribute = attribute;
        })
    }


})