pimsApp.controller('AttributeSetListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'AttributeSetModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                                    $location,
                                                                                    $http,
                                                                                    $rootScope,
                                                                                    AttributeSetModel,
                                                                                    NgTableParams) {
        $scope.init = function () {
            var entity_type_uuid = $rootScope.pims.entities.current.uuid;
            AttributeSetModel.findAll(entity_type_uuid).then(function (attribute_sets) {
                $scope.attrSetTableParams = new NgTableParams({}, {dataset: attribute_sets});
            })
        };

        $scope.createAttributeSet = function () {
            $location.path("/attribute-sets/new");
        }


    }]);