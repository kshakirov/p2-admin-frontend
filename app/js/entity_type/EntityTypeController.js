pimsApp.controller('EntityTypeController',["$scope", "$rootScope","$http",
    'EntityTypeModel', function ($scope,  $rootScope, $http, EntityTypeModel ) {

    function choose_product(entities) {
        var entity = entities.filter(function (entity) {
            if (entity.name === 'Product') {
                return entity;
            }
        });
        return entity[0]
    }

    $scope.init = function () {
        EntityTypeModel.findAll().then(function (entities) {
            $rootScope.pims = {
                entities: {
                    current: choose_product(entities),
                    list: entities.data
                }
            }
        })
    };

    $scope.selectEntity = function () {
        console.log("selectEntity")
    }
}]);