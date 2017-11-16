pimsApp.controller('RoleController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'RoleModel', 'MessageService',
    'ResourceModel','PermissionModel', '$q',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              RoleModel,
              MessageService,
              ResourceModel,
              PermissionModel,
              $q) {


        $rootScope.message = MessageService.prepareMessage();




        function loadDependencies() {
                 return $q.all([PermissionModel.findAll(), ResourceModel.findAll()]);
        }

        function loadAll(id) {
            return $q.all([PermissionModel.findAll(), ResourceModel.findAll(), RoleModel.findOne(id)]);
        }


        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                loadDependencies().then(function (promises) {
                    $scope.role = {
                        resources: []
                    };
                    $scope.resources = promises[1];
                    $scope.permissions = promises[0];
                })

            } else {
                loadAll(id).then(function (promises) {
                    $scope.role = promises[2];
                    $scope.resources = promises[1];
                    $scope.permissions = promises[0];
                })
            }
        };

        $scope.updateRole = function (role) {
            if (role.id) {
                RoleModel.update(role).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Role Updated");
                })
            } else {
                RoleModel.create(role).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Role Created");
                })
            }
        };

        $scope.deleteRole = function (id) {
            RoleModel.delete(id).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/roles");
        }

        $scope.addResource = function () {
            $scope.role.resources.push({})
        };

        $scope.removeResource = function (index) {
            $scope.role.resources.splice(index, 1);
        };

    }]);