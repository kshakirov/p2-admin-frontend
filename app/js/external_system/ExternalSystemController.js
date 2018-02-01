pimsApp.controller('ExternalSystemController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalSystemModel',
    'EntityTypeResolver', 'EntityTypeModel', 'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              ExternalSystemModel,
              EntityTypeResolver,
              EntityTypeModel,
              MessageService) {

        $scope.triggers = ["ON_DEMAND", "CRON", "AUTOMATIC", "NEVER"];
        $scope.system_types = [
            {name: 'REST', id: 0},
            {name: 'XML-RPC', id: 1},
            {name: 'AMAZON', id: 2}
        ];
        $rootScope.message = MessageService.prepareMessage();
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

        $scope.helpers = EntityTypeResolver.createHelpers();

        $scope.updateExternalSystem = function (external_system) {
            if (external_system.id) {
                return ExternalSystemModel.update(external_system).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "External System Updated");
                    return response
                })
            } else {
                return ExternalSystemModel.save(external_system).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "External System Created");
                    return response
                })
            }
        };

        $scope.deleteExternalSystem = function (id) {
            ExternalSystemModel.delete(id).then(function (response) {
            })
        };

        $scope.createEntityTypeEntry = function (entityType, helpers, helper_id) {
            $scope.item = EntityTypeResolver.initItem(entityType,helpers, helper_id);
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