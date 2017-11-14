pimsApp.controller('PermissionController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'PermissionModel', 'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              PermissionModel,
              MessageService) {


        $rootScope.message = MessageService.prepareMessage();

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {

            } else {
                PermissionModel.findOne(id).then(function (permission) {
                    $scope.attribute = permission;
                })
            }
        };

        $scope.updatePermission = function (user) {
            if (user.id) {
                PermissionModel.update(user).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Permission Updated");
                })
            } else {
                PermissionModel.create(user).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Permission Created");
                })
            }
        };

        $scope.deletePermission = function (id) {
            PermissionModel.delete(id).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/permissions");
        }

    }]);