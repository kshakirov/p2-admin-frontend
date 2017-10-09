pimsApp.controller('CustomSyncOperationListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'CustomSyncOperationModel', 'NgTableParams', function ($scope, $route, $routeParams,
                                                                                               $location,
                                                                                               $http,
                                                                                               $rootScope,
                                                                                               CustomSyncOperationModel,
                                                                                               NgTableParams) {

        $scope.init = function () {
            CustomSyncOperationModel.findAll().then(function (custom_sync_operations) {
                console.log(custom_sync_operations);
                $scope.customSyncOperationsTableParams = new NgTableParams({}, {dataset: custom_sync_operations});
            })
        };

        $scope.createCustomSyncOperation = function () {
            $location.path("/custom-sync-operations/new");
        }

    }])