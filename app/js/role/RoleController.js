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




        function getDependencies() {
                 return $q.all([PermissionModel.findAll(), ResourceModel.findAll()]);
        }

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                getDependencies().then(function (promises) {
                    $scope.role = {
                        resources: []
                    };
                    $scope.resources = promises[1];
                    $scope.permissions = promises[0];
                })

            } else {
                RoleModel.findOne(id).then(function (role) {
                    $scope.role = role;
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