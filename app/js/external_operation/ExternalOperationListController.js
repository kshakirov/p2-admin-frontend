pimsApp.controller('ExternalOperationListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalOperationModel', 'NgTableParams', function ($scope, $route, $routeParams,
                                                                                             $location,
                                                                                             $http,
                                                                                             $rootScope,
                                                                                             ExternalOperationModel,
                                                                                             NgTableParams) {

        $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL"];

        $scope.init = function () {
            ExternalOperationModel.findAll().then(function (externalOperations) {
                console.log(externalOperations);
                $scope.externalOperationsTableParams = new NgTableParams({}, {dataset: externalOperations});
            })
        };

        $scope.createExternalOperation = function () {
            $location.path("/external-operations/new");
        }

    }])