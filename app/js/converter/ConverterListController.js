pimsApp.controller('ConverterListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'ConverterModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                                    $location,
                                                                                    $http,
                                                                                    $rootScope,
                                                                                    ConverterModel,
                                                                                    NgTableParams) {
        $scope.init = function () {
            ConverterModel.findAll().then(function (converters) {
                $scope.converterTableParams = new NgTableParams({}, {dataset: converters});
            });
        };

        $scope.createConverter = function () {
            $location.path("/converters/new");
        }


    }]);