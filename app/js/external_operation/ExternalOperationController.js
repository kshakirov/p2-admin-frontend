pimsApp.controller('ExternalOperationController' ,[ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'ExternalOperationModel',  function ($scope, $route, $routeParams,
                                                                     $location,
                                                                     $http,
                                                                     $rootScope,
                                                                             ExternalOperationModel) {

        $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL"];

        $scope.init = function () {
            ExternalOperationModel.findAll().then(function (operations) {
                console.log(operations);
            })
        }

    }])