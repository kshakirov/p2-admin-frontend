pimsApp.controller('AttributeListCtrl', function ($scope, $route, $routeParams,
                                              $location,
                                              $http,
                                              $rootScope,
                                              AttributeModel,
                                              NgTableParams) {
    console.log("PimsApp AttributeCtrl");
    $scope.init = function () {

        AttributeModel.all().then(function (attributes) {
            $scope.tableParams = new NgTableParams({}, {dataset: attributes});
        })
    }


})