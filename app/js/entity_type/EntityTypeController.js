pimsApp.controller('EntityTypeController', ["$scope", "$rootScope", "$http",
    'EntityTypeModel', '$cookies', '$location', '$routeParams', '$window',
    '$uibModal',
    function ($scope, $rootScope, $http, EntityTypeModel,
              $cookies, $location, $routeParams, $window, $uibModal) {

        $rootScope.message = {};

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
    }]);

