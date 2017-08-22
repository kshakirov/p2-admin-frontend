pimsApp.controller('AttributeListController', function ($scope, $route, $routeParams,
                                                  $location,
                                                  $http,
                                                  $rootScope,
                                                  AttributeModel,
                                                  NgTableParams) {
    $scope.init = function () {
        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        AttributeModel.findAll(entity_type_uuid).then(function (attributes) {
            $scope.tableParams = new NgTableParams({}, {dataset: attributes});
        })
    };

    $scope.createAttribute = function () {
        $location.path("/attributes/new");
    }


});