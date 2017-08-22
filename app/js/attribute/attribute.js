pimsApp.controller('AttributeCtrl', function ($scope, $route, $routeParams,
                                              $location,
                                              $http,
                                              $rootScope,
                                              AttributeModel,
                                              NgTableParams) {
    console.log("PimsApp AttributeCtrl");
    $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL"]
    $scope.init = function () {
        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        var uuid = $routeParams.uuid;
        AttributeModel.findOne(entity_type_uuid, uuid).then(function (attribute) {
            console.log(attribute);
            $scope.attribute = attribute;
        })
    }


})