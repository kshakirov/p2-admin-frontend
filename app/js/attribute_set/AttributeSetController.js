pimsApp.controller('AttributeSetController' ,[ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'AttributeSetModel',   function ($scope, $route, $routeParams,
                                                                     $location,
                                                                     $http,
                                                                     $rootScope, AttributeSetModel) {

        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        $scope.init = function () {
            var uuid = $routeParams.uuid;
            if(uuid === "new"){

            }else {
                AttributeSetModel.findOne(entity_type_uuid, uuid).then(function (attribute_set) {
                    $scope.attribute_set = attribute_set;
                })
            }
        };

        $scope.updateAttribute = function (attribute) {
            AttributeSetModel.save(entity_type_uuid, attribute).then(function (response) {
            })
        };

        $scope.deleteAttribute = function (uuid) {
            AttributeSetModel.delete(entity_type_uuid, uuid).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/attribute-sets");
        }

    }]);
