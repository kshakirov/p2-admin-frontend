pimsApp.controller('TransformationSchemaListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'TransformationSchemaModel','NgTableParams',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              TransformationSchemaModel,
              NgTableParams) {

        $scope.init = function () {
            TransformationSchemaModel.findAll().then(function (schemata) {
                $scope.schemataTableParams = new NgTableParams({}, {dataset: schemata});
            });
        };

        $scope.createSchema = function () {
            $location.path("/transformation-schemata/new");
        }
    }])