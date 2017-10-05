pimsApp.controller('CustomSyncOperationController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'CustomSyncOperationModel', 'NotificationModel',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              CustomSyncOperationModel,
              NotificationModel) {

        $scope.init = function () {
            CustomSyncOperationModel.findOne(1).then(function (custom_sync_operation) {
                console.log(custom_sync_operation);
                $scope.custom_sync_operation = custom_sync_operation;
            })
        };


        $scope.cancel = function () {
            $location.path("/custom-sync-operations");
        }

        $scope.runCustomSyncOperation = function (custom_sync_operation) {
            var data = {
                "name": "PERFORM_BATCH_SYNCHRONIZATION",
                "exteral_operation_id": 19
            };
            console.log(data);
            NotificationModel.notifyBatch(data).then(function (response) {
                $rootScope.message.success = true;
            })

        }


    }]);