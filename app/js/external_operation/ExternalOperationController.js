pimsApp.controller('ExternalOperationController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalOperationModel', function ($scope, $route, $routeParams,
                                                                            $location,
                                                                            $http,
                                                                            $rootScope,
                                                                            ExternalOperationModel) {

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {

            } else {
                ExternalOperationModel.findOne(id).then(function (external_operation) {
                    $scope.external_operation = external_operation;
                })
            }
        };

        $scope.updateExternalOperation = function (external_operation) {
            ExternalOperationModel.save(attribute).then(function (response) {
            })
        };

        $scope.deleteExternalOperation = function (id) {
            ExternalOperationModel.delete(id).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/external-operations");
        }
    }])