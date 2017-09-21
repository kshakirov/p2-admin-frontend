pimsApp.controller('ExternalSystemController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalSystemModel',
    'EntityTypeResolver', 'EntityTypeModel', function ($scope, $route, $routeParams,
                                                       $location,
                                                       $http,
                                                       $rootScope,
                                                       ExternalSystemModel,
                                                       EntityTypeResolver, EntityTypeModel) {

        $scope.triggers = ["ON_DEMAND", "CRON", "AUTOMATIC", "NEVER"];
        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                $scope.external_system = {
                    customAttributes: {}
                }
            } else {
                ExternalSystemModel.findOne(id).then(function (external_system) {
                    $scope.external_system = external_system;
                })
            }
            EntityTypeModel.findAll().then(function (entity_types) {
                $scope.entity_types = entity_types;
            })
        };

        $scope.updateExternalSystem = function (external_system) {
            if (external_system.id) {
                return ExternalSystemModel.update(external_system).then(function (response) {
                    return response
                })
            } else {
                return ExternalSystemModel.save(external_system).then(function (response) {
                    return response
                })
            }
        };

        $scope.deleteExternalSystem = function (id) {
            ExternalSystemModel.delete(id).then(function (response) {
            })
        };

        $scope.createEntityTypeEntry = function (entityType) {
            $scope.item = EntityTypeResolver.initItem(entityType);
            $scope.item_key = entityType.uuid;

        };

        $scope.removeEntity = function (key) {
            delete $scope.external_system.customAttributes.entities[key];
        };

        $scope.editEntity = function (key) {
            $scope.item = {};
            $scope.item[key] = $scope.external_system.customAttributes.entities[key];
            $scope.item_key = key;
        };

        $scope.saveEntityTypeEntry = function (item) {
            if (!$scope.external_system.customAttributes.entities) {
                $scope.external_system.customAttributes.entities = {};
            }
            $scope.external_system.customAttributes.entities[$scope.item_key]
                = item[$scope.item_key];
        };

        $scope.cancel = function () {
            $location.path("/external-systems");
        }
    }]);