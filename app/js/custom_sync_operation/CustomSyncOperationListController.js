pimsApp.controller('CustomSyncOperationListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'CustomSyncOperationModel', 'NgTableParams',
    'CustomSyncNotificationService', '$q', 'ExternalOperationModel', 'EntityTypeModel',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              CustomSyncOperationModel,
              NgTableParams,
              CustomSyncNotificationService,
              $q,
              ExternalOperationModel,
              EntityTypeModel) {


        $scope.operations = CustomSyncNotificationService.getNotifications();


        $scope.init = function () {
            $q.all(
                {
                    pipes: ExternalOperationModel.findAll(),
                    entityTypes: EntityTypeModel.findAll(),
                    operations: CustomSyncOperationModel.findAll()
                }
            ).then(function (promise) {
                var custom_sync_operations = preprocess_custom_operations(promise.operations,
                    promise.entityTypes, promise.pipes);
                $scope.customSyncOperationsTableParams = new NgTableParams({}, {dataset: custom_sync_operations});
            })
        };

        $scope.createCustomSyncOperation = function () {
            $location.path("/custom-sync-operations/new");
        };


        function preprocess_custom_operations(custom_sync_operations, entity_types,
                                              pipes) {
            var operations = add_enttiy_type(custom_sync_operations,entity_types);
            operations = add_pipe(custom_sync_operations,pipes)
            return operations
        }

        function add_enttiy_type(custom_sync_operations, entity_types) {
            var operations = custom_sync_operations;
            operations.map(function (op) {
                var entity_type = entity_types.find(function (et) {
                    if (et.uuid === op.customAttributes.entityTypeId.uuid)
                        return true
                });
                op.entityTypeName = entity_type.name
            });
            return operations;
        }


        function add_pipe(custom_sync_operations, pipes) {
            var operations = custom_sync_operations;
            operations.map(function (op) {
                var pipe = pipes.find(function (p) {
                    if (p.id === op.customAttributes.pipe.id)
                        return true
                });
                op.pipeName = pipe.name
            });
            return operations;
        }


    }]);