pimsApp.controller('PermissionListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'PermissionModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                               $location,
                                                                               $http,
                                                                               $rootScope,
                                                                                     PermissionModel,
                                                                               NgTableParams) {
        $scope.init = function () {
            PermissionModel.findAll().then(function (permissions) {
                $scope.tableParams = new NgTableParams({}, {dataset: permissions});
            });
        };

        $scope.createPermission = function () {
            $location.path("/permissions/new");
        }


    }]);