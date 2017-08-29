pimsApp.controller('EntityController' ,[ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'EntityModel',  function ($scope, $route, $routeParams,
                                                                     $location,
                                                                     $http,
                                                                     $rootScope,
                                                                  EntityModel) {

        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        $scope.init = function () {
            var uuid = $routeParams.uuid;
            if(uuid === "new"){

            }else {
                EntityModel.findOne(entity_type_uuid, uuid).then(function (entity) {
                    $scope.entity = entity;
                })
            }
        };

        $scope.updateEntity = function (entity) {
            EntityModel.save(entity_type_uuid, entity).then(function (response) {
            })
        };

        $scope.deleteEntity = function (uuid) {
            EntityModel.delete(entity_type_uuid, uuid).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/entities");
        }

    }]);