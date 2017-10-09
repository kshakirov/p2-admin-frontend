pimsApp.controller('CustomSyncOperationController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'CustomSyncOperationModel', 'NotificationModel',
    '$q', 'ExternalOperationModel', 'TransformationSchemaModel', 'EntityTypeModel',
    'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              CustomSyncOperationModel,
              NotificationModel,
              $q,
              ExternalOperationModel,
              TransformationSchemaModel,
              EntityTypeModel,
              MessageService) {

        var loads = [
            ExternalOperationModel.findAll(),
            TransformationSchemaModel.findAll(),
            EntityTypeModel.findAll()
        ];
        $rootScope.message = MessageService.prepareMessage();

        var message = {
            CustomOperation: {
                name: null,
                pipelineId: null,
                entityTypeId: null
            },
            EntityInfo: {
                id: null,
                entityTypeId: null
            },
            PipelineInfo: {}
        };

        $scope.init = function () {
            var id = $routeParams.id;
            $q.all(loads).then(function (promises) {
                $scope.transformationSchemata = promises[1];
                $scope.pipes = promises[0];
                $scope.entityTypes = promises[2];
                if (id === "new") {
                    $scope.custom_sync_operation = {}
                } else {
                    CustomSyncOperationModel.findOne(id).then(function (custom_sync_operation) {
                        $scope.custom_sync_operation = custom_sync_operation;
                    })
                }
            })

        };

        $scope.saveCustomSyncOperation = function (custom_sync_operaton) {
            if (custom_sync_operaton.id) {
                CustomSyncOperationModel.update(custom_sync_operaton).then(function (promise) {
                    MessageService.setSuccessMessage($rootScope.message, "Your Custom Operation Saved!")
                })
            } else {
                CustomSyncOperationModel.create(custom_sync_operaton).then(function (promise) {
                    MessageService.setSuccessMessage($rootScope.message, "Your Custom Operation Started!")
                })
            }
        };

        $scope.deleteCustomSyncOperation = function (id) {
            CustomSyncOperationModel.delete(id).then(function (promise) {
                MessageService.setDangerMessage($rootScope.message, "Your Custom Operation Deleted!")
            })
        };

        $scope.cancel = function () {
            $location.path("/custom-sync-operations");
        };

        $scope.runCustomSyncOperation = function (custom_sync_operation) {
            var queue_prefix = custom_sync_operation.customAttributes.queuePrefix;
            message.CustomOperation.name = custom_sync_operation.name;
            message.CustomOperation.pipelineId = custom_sync_operation.customAttributes.pipe.id;
            message.CustomOperation.entityTypeId = custom_sync_operation.customAttributes.entityTypeId.uuid;
            message.EntityInfo.entityTypeId = custom_sync_operation.customAttributes.entityTypeId.uuid;
            NotificationModel.notifyBatch(message, queue_prefix).then(function (response) {
                $rootScope.message.success = true;
                MessageService.setInfoMessage($rootScope.message, "Your Operation Has Just Scheduled for Run")
            })

        }


    }]);