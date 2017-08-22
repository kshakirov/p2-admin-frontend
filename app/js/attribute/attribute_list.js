pimsApp.controller('AttributeListCtrl', function ($scope, $route, $routeParams,
                                                  $location,
                                                  $http,
                                                  $rootScope,
                                                  AttributeModel,
                                                  NgTableParams) {
    console.log("PimsApp AttributeCtrl");
    $scope.init = function () {
        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        AttributeModel.findAll(entity_type_uuid).then(function (attributes) {
            $scope.tableParams = new NgTableParams({}, {dataset: attributes});
        })
    }


});