pimsApp.controller('ExternalOperationListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalOperationModel',
    'NgTableParams', 'ExternalSystemModel',
    function ($scope, $route,
              $routeParams,
              $location,
              $http,
              $rootScope,
              ExternalOperationModel,
              NgTableParams,
              ExternalSystemModel) {

        $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL"];


        function add_external_systems(externalOperations, externalSystems) {
            return externalOperations.map(function (eop) {
                var ss = externalSystems.find(function (ess) {
                    if (ess.id === eop.targetSystem.frontendInfo.selected.id)
                        return true
                });
                var ts = externalSystems.find(function (ess) {
                    if (ess.id === eop.sourceSystem.frontendInfo.selected.id)
                        return true
                });
                eop.source = ss.name;
                eop.target = ts.name;
                return eop;
            })
        }


        $scope.init = function () {
            ExternalOperationModel.findAll().then(function (externalOperations) {
                ExternalSystemModel.findAll().then(function (externalSystems) {
                    var enriched_operations = add_external_systems(externalOperations, externalSystems);
                    $scope.externalOperationsTableParams = new NgTableParams({}, {dataset: enriched_operations});
                })

            })
        };

        $scope.createExternalOperation = function () {
            $location.path("/external-operations/new");
        }

    }])