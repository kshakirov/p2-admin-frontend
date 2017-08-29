pimsApp.controller('EntityListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'EntityModel', 'NgTableParams', function ($scope, $route, $routeParams,
                                                                                  $location,
                                                                                  $http,
                                                                                  $rootScope,
                                                                                  EntityModel,
                                                                                  NgTableParams) {
        var entity_type_uuid = $rootScope.pims.entities.current.uuid;

        $scope.init = function () {

            EntityModel.findAll(entity_type_uuid, 0).then(function (entities) {
                $scope.entitiesTableParams = new NgTableParams({}, {dataset: entities});
            }, function (error) {
                console.log(error);
            })
        };

        $scope.createAttributeSet = function () {
            $location.path("/entities/new");
        }


    }]);