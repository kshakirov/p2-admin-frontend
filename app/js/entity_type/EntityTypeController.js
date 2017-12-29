pimsApp.controller('EntityTypeController', ["$scope", "$rootScope", "$http",
    'EntityTypeModel', '$cookies', '$location', '$routeParams', '$window',
    '$uibModal', 'MessageService', 'CustomSyncNotificationService','socket',
    'ngNotify',
    function ($scope, $rootScope, $http, EntityTypeModel,
              $cookies, $location, $routeParams, $window, $uibModal,
              MessageService, CustomSyncNotificationService,socket,ngNotify) {

        $rootScope.message = {};
        $rootScope.message = MessageService.prepareMessage();


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

                })
            } else {
                EntityTypeModel.create(entityType).then(function () {

                })
            }
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

            ngNotify.set('Entity [' + data.pimsId + "] synced To External System [" + data.extSysId + "]");
        });

        socket.on('connection', function (data) {
            console.log("Connected")
        });

        socket.on('disconnect', function (data) {
            console.log("Disonnected")
        })
    }]);

