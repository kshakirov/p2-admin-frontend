pimsApp.controller('GroupListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'GroupModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                               $location,
                                                                               $http,
                                                                               $rootScope,
                                                                               GroupModel,
                                                                               NgTableParams) {
        $scope.init = function () {
            GroupModel.findAll().then(function (groups) {
                $scope.tableParams = new NgTableParams({}, {dataset: groups});
            });
        };

        $scope.createGroup = function () {
            $location.path("/groups/new");
        }


    }]);