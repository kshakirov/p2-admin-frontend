pimsApp.controller('CustomSyncOperationListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'CustomSyncOperationModel', 'NgTableParams',
    'CustomSyncNotificationService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              CustomSyncOperationModel,
              NgTableParams,
              CustomSyncNotificationService) {


        $scope.operations = CustomSyncNotificationService.getNotifications();

        $scope.init = function () {
            CustomSyncOperationModel.findAll().then(function (custom_sync_operations) {
                console.log(custom_sync_operations);
                $scope.customSyncOperationsTableParams = new NgTableParams({}, {dataset: custom_sync_operations});
            })
        };

        $scope.createCustomSyncOperation = function () {
            $location.path("/custom-sync-operations/new");
        };


    }]);