pimsApp.controller('FilterListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'FilterModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                                    $location,
                                                                                    $http,
                                                                                    $rootScope,
                                                                                    FilterModel,
                                                                                    NgTableParams) {
        $scope.init = function () {
            FilterModel.findAll().then(function (filters) {
                $scope.filterTableParams = new NgTableParams({}, {dataset: filters});
            });
        };

        $scope.createFilter = function () {
            $location.path("/filters/new");
        }


    }]);