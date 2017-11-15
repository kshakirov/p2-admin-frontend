pimsApp.controller('RoleListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'RoleModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                                     $location,
                                                                                     $http,
                                                                                     $rootScope,
                                                                                        RoleModel,
                                                                                     NgTableParams) {
        $scope.init = function () {
            RoleModel.findAll().then(function (roles) {
                $scope.tableParams = new NgTableParams({}, {dataset: roles});
            });
        };

        $scope.createRole = function () {
            $location.path("/roles/new");
        }


    }]);