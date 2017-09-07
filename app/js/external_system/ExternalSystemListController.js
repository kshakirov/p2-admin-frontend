pimsApp.controller('ExternalSystemListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalSystemModel', 'NgTableParams', function ($scope, $route, $routeParams,
                                                                                             $location,
                                                                                             $http,
                                                                                             $rootScope,
                                                                                          ExternalSystemModel,
                                                                                             NgTableParams) {

        $scope.init = function () {
            ExternalSystemModel.findAll().then(function (external_systems) {
                console.log(external_systems);
                $scope.externalSystemsTableParams = new NgTableParams({}, {dataset: external_systems});
            })
        };

        $scope.createExternalSystem = function () {
            $location.path("/external-systems/new");
        }

    }])