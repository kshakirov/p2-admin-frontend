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
                "name": "PERFORM_EXTERNAL_OPERATION",
                "exteral_operation_id": 5
            };
            console.log(data);
            NotificationModel.notify(data).then(function (response) {

            })

        }


    }]);