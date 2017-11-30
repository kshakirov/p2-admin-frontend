pimsApp.controller('EntityTypeController', ["$scope", "$rootScope", "$http",
    'EntityTypeModel', '$cookies', '$location', '$routeParams', '$window',
    '$uibModal',
    function ($scope, $rootScope, $http, EntityTypeModel,
              $cookies, $location, $routeParams, $window,$uibModal) {
        var selectedTypes = ['product', 'supplier', 'product uom'];


        function store_entity_types(entities) {
            var entities = entities.filter(function (entity) {
                if (!entity.deleted)
                    return entity;
            });
            $cookies.putObject("entityTypes", entities);
        }

        function set_current_entity_type(entities) {
            var currentEntity =  $cookies.getObject("currentEntity");
            if(angular.isUndefined(currentEntity)) {
                $rootScope.pims = {
                    entities: {
                        current: entities[3],
                        list: entities
                    }
                };
            }else{
                var entity = entities.find(function (v) {
                    if(v.name==currentEntity.name){
                        return v;
                    }
                })
                $rootScope.pims = {
                    entities: {
                        current: entity,
                        list: entities
                    }
                };
            }
        }


        function get_stored_entities() {
            return $cookies.getObject("entityTypes")
        }

        function set_entities() {
            return EntityTypeModel.findAll().then(function (entities) {
                store_entity_types(entities);
                var entities = get_stored_entities();
                set_current_entity_type(entities);
                return true;
            })
        }

        $rootScope.message = {};

        $scope.init = function () {
            var currentEntity =  $cookies.getObject("currentEntity");
            if(angular.isUndefined(currentEntity)) {
                EntityTypeModel.findAll().then(function (entity_types) {
                    $rootScope.pims = {
                        entities: {
                            current: entity_types[0],
                        }
                    };
                })
            }else{
                $rootScope.pims = {
                    entities: {
                        current: currentEntity,
                    }
                };
            }
        };

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
            if (entityType.uuid) {
                EntityTypeModel.update(entityType).then(function () {
                    set_entities().then(function () {
                        console.log("loaded");
                    })
                })
            } else {
                EntityTypeModel.create(entityType).then(function () {
                    set_entities().then(function () {
                        console.log("loaded");
                    })
                })
            }
        };

        $scope.logout = function () {
            $cookies.remove("token");
            $window.location.href = '/auth/login';
        };

        $scope.cancel = function () {
            $location.path("/entity-types");
        }

        $scope.open = function (attr, callback) {
            console.log('opening pop up');
            var attr = attr;
            $scope.selected_reference = null;
            var $uibModalInstance = modalInstance = $uibModal.open({
                templateUrl: 'partial/entity_type/entity_type_modal',
                controller: createEntityTypeModalController(attr),
                resolve: {
                    user: function () {
                        return "Return";
                    }
                }
            });
            $uibModalInstance.result.then(function (result) {
                console.log(result);
                $rootScope.pims.entities.current = result.entityType;
                $cookies.putObject("currentEntity", result.entityType);
                $location.path("/");
            }, function () {
            });

        };
    }]);

