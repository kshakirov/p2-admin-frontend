pimsApp.controller('EntityTypeController', ["$scope", "$rootScope", "$http",
    'EntityTypeModel', '$cookies', '$location', '$routeParams', function ($scope, $rootScope, $http, EntityTypeModel,
                                             $cookies, $location, $routeParams) {
        var selectedTypes = ['product', 'supplier', 'product uom'];


        function store_entity_types(entities) {
            var entities = entities.filter(function (entity) {
                if (!entity.deleted)
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

        $scope.initialize = function () {
            var uuid = $routeParams.uuid;
            if (uuid === "new") {
                $scope.entityType = {}

            } else {
                EntityTypeModel.findOne(uuid).then(function (entityType) {
                    $scope.entityType = entityType;
                })
            }
        };

        $scope.updateEntityType = function (entityType) {
            if(entityType.uuid){
                EntityTypeModel.update(entityType).then(function () {

                })
            }else{
                EntityTypeModel.create(entityType).then(function () {

                })
            }
        }

        $scope.cancel = function () {
            $location.path("/entity-types");
        }
    }]);

