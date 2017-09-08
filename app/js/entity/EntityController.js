pimsApp.controller('EntityController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'EntityModel', 'EntityService',
    'AttributeSetModel',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              EntityModel,
              EntityService,
              AttributeSetModel) {

        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        $scope.init = function () {
            var uuid = $routeParams.uuid;
            if (uuid === "new") {

            } else {
                var params_string = "properties.role=tab";
                EntityModel.findOne(entity_type_uuid, uuid).then(function (entity) {
                    AttributeSetModel.search(entity_type_uuid, params_string).then(function (tabs) {
                        $scope.tabs = tabs;
                        $scope.entity = entity;
                        //$scope.entity.attributes = EntityService.filterSimpleAttributes(entity.attributes);
                    })
                })
            }
        };

        $scope.updateEntity = function (entity) {
            var entity_copy = {};
            angular.copy(entity, entity_copy);
            entity_copy.attributes = EntityService.prepAttributesDto(entity.attributes);
            EntityModel.save(entity_type_uuid, entity_copy).then(function (response) {
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