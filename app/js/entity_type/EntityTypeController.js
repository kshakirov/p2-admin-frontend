pimsApp.controller('EntityTypeController', ["$scope", "$rootScope", "$http",
    'EntityTypeModel', '$cookies', '$location', function ($scope, $rootScope, $http, EntityTypeModel,
                                             $cookies, $location) {
        var selectedTypes = ['product', 'supplier', 'product uom'];


        function store_entity_types(entities) {
            var entities = entities.filter(function (entity) {
                if (selectedTypes.includes(entity.name.toLowerCase()))
                    return entity;
            });
            $cookies.putObject("entityTypes", entities);
        }

        function set_current_entity_type(entities) {
            $rootScope.pims = {
                entities: {
                    current: entities[0],
                    list: entities
                }
            };
        }


        function get_stored_entities() {
            return $cookies.getObject("entityTypes")
        }

        $rootScope.message = {};

        $scope.init = function () {
            var entites = get_stored_entities();
            if (!entites) {
                EntityTypeModel.findAll().then(function (entities) {
                    store_entity_types(entities);
                    var entities = get_stored_entities();
                    set_current_entity_type(entities);
                })
            }else{
                set_current_entity_type(entites);

            }
        };

        $scope.selectEntity = function (entityType) {
            $rootScope.pims.entities.current = entityType;
            $location.path("/");
        }
    }]);