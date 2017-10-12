pimsApp.controller('EntityTypeListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'EntityTypeModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                                    $location,
                                                                                    $http,
                                                                                    $rootScope,
                                                                                     EntityTypeModel,
                                                                                    NgTableParams) {
        $scope.init = function () {
            EntityTypeModel.findAll().then(function (entityTypes) {
                $scope.tableParams = new NgTableParams({}, {dataset: entityTypes});
            });
        };

        $scope.createEntityType = function () {
            $location.path("/entity-types/new");
        }


    }]);