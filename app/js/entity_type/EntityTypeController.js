pimsApp.controller('EntityTypeController', ["$scope", "$rootScope", "$http",
    'EntityTypeModel', '$cookies', '$location', '$routeParams', '$window',
    '$uibModal', 'MessageService', 'CustomSyncNotificationService','socket',
    'ngNotify', 'ExternalSystemModel',
    function ($scope, $rootScope, $http, EntityTypeModel,
              $cookies,
              $location,
              $routeParams,
              $window,
              $uibModal,
              MessageService,
              CustomSyncNotificationService,
              socket,
              ngNotify,
              ExternalSystemModel) {

        $rootScope.message = {};
        var systems = [];

        $scope.init = function () {
            var currentEntity = $cookies.getObject("currentEntity");
            if (angular.isUndefined(currentEntity)) {
                EntityTypeModel.findAll().then(function (entity_types) {
                    $rootScope.pims = {
                        entities: {
                            current: entity_types[0],
                        }
                    };
                })
            } else {
                $rootScope.pims = {
                    entities: {
                        current: currentEntity,
                    }
                };
            }

            ExternalSystemModel.findAll().then(function (external_systems) {
                systems = external_systems;
            })
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
                    ngNotify.set("Entity Type Updated", 'success');
                })
            } else {
                EntityTypeModel.create(entityType).then(function () {
                    ngNotify.set("Entity Type Created", 'success');
                })
            }
        };

        $scope.deleteEntityType = function (uuid, entity_type) {
            EntityTypeModel.delete(uuid).then(function () {
                entity_type.deleted = true;
                ngNotify.set("Entity Type Marked Ad 'DELETED'", 'success');
            })
        };

        $scope.logout = function () {
            $cookies.remove("token");
            $window.location.href = '/auth/login';
        };

        $scope.cancel = function () {
            $location.path("/entity-types");
        };

        $scope.open = function (attr, callback) {
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

        socket.on('log', function (data) {
            if(Object.keys(data).length > 0) {
                $scope.$apply(function () {
                    CustomSyncNotificationService.processMessage(data.message)
                });
            }
        });

        socket.on('individual', function (data) {
           var systemName = systems.find(function (s) {
               if(s.id==data.extSysId)
                   return true
           }) ;
           if(systemName.hasOwnProperty('name'))
               systemName = systemName.name;
            ngNotify.set('Entity [' + data.pimsId + "] synced To External System [" + systemName + "]");
        });

        socket.on('connection', function (data) {
            console.log("Connected")
        });

        socket.on('disconnect', function (data) {
            console.log("Disonnected")
        })
    }]);

