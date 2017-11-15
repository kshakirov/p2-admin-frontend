pimsApp.controller('ResourceListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'ResourceModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                               $location,
                                                                               $http,
                                                                               $rootScope,
                                                                                   ResourceModel,
                                                                               NgTableParams) {
        $scope.init = function () {
            ResourceModel.findAll().then(function (resources) {
                $scope.tableParams = new NgTableParams({}, {dataset: resources});
            });
        };

        $scope.createResource = function () {
            $location.path("/resources/new");
        }


    }]);