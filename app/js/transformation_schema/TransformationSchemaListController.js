pimsApp.controller('TransformationSchemaListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'TransformationSchemaModel', 'NgTableParams',
    'EntityTypeModel', '$q',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              TransformationSchemaModel,
              NgTableParams,
              EntityTypeModel,
              $q) {


        $scope.init = function () {
            $q.all([TransformationSchemaModel.findAll(), EntityTypeModel.findAll()]).then(function (promises) {
                var schemata = add_enttiy_type(promises[0], promises[1]);
                $scope.schemataTableParams = new NgTableParams({}, {dataset: schemata});
            })
        };

        $scope.createSchema = function () {
            $location.path("/transformation-schemata/new");
        };


        function add_enttiy_type(schemata, entity_types) {
            var schemata = schemata;
            schemata.map(function (s) {
                var entity_type = entity_types.find(function (et) {
                    if (et.uuid === s.customAttributes.entity.uuid)
                        return true
                });
                s.customAttributes.entity.name = entity_type.name
            });
            return schemata;
        }
    }]);