pimsApp.controller('AttributeController' ,[ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'AttributeModel',  function ($scope, $route, $routeParams,
                                              $location,
                                              $http,
                                              $rootScope,
                                              AttributeModel) {

    $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL", "INTEGER"];
    $scope.frontendTypes = ["text", "number", "email", "password", "date", "select", "multiselect"];
    var entity_type_uuid = $rootScope.pims.entities.current.uuid;
    $scope.init = function () {
        var uuid = $routeParams.uuid;
        if(uuid === "new"){

        }else {
            AttributeModel.findOne(entity_type_uuid, uuid).then(function (attribute) {
                $scope.attribute = attribute;
            })
        }
    };

    $scope.updateAttribute = function (attribute) {
        AttributeModel.save(entity_type_uuid, attribute).then(function (response) {
        })
    };

    $scope.deleteAttribute = function (uuid) {
        AttributeModel.delete(entity_type_uuid, uuid).then(function (response) {
        })
    };

    $scope.cancel = function () {
        $location.path("/attributes");
    }

}]);