pimsApp.controller('ExternalSystemListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalSystemModel', 'NgTableParams', function ($scope, $route, $routeParams,
                                                                                          $location,
                                                                                          $http,
                                                                                          $rootScope,
                                                                                          ExternalSystemModel,
                                                                                          NgTableParams) {

        var systemTypes = [
            {name: 'REST', id: 0},
            {name: 'XML-RPC', id: 1},
            {name: 'AMAZON', id: 2}
        ];


        function prep_system_type(external_systems) {
            return external_systems.map(function (es) {
                es.systemType = systemTypes.find(function (t) {
                    if(t.id===es.customAttributes.system_id)
                        return true;
                    return false
                });
                es.systemType = es.systemType.name;
                return es;
            })
        }


        function prep_batch_size(external_systems) {
            return external_systems.map(function (es) {
                var batchSize = 0;
                if(es.customAttributes.hasOwnProperty('openerp')){
                    batchSize = es.customAttributes.openerp.batchsize;
                }
                es.batchSize = batchSize;
                return es;
            })
        }

        function prep_external_systems(external_systems) {
            return prep_batch_size(prep_system_type(external_systems))
        }

        $scope.init = function () {
            ExternalSystemModel.findAll().then(function (external_systems) {

                $scope.externalSystemsTableParams = new NgTableParams({}, {dataset: prep_external_systems(external_systems)});
            })
        };

        $scope.createExternalSystem = function () {
            $location.path("/external-systems/new");
        }

    }])