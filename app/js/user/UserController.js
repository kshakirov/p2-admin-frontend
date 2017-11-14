pimsApp.controller('UserController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'UserModel', 'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              UserModel,
              MessageService) {


        $rootScope.message = MessageService.prepareMessage();

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {

            } else {
                UserModel.findOne(id).then(function (user) {
                    $scope.attribute = user;
                })
            }
        };

        $scope.updateUser = function (user) {
            if (user.id) {
                UserModel.update(user).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "User Updated");
                })
            } else {
                UserModel.create(user).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "User Created");
                })
            }
        };

        $scope.deleteUser = function (id) {
            UserModel.delete(id).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/users");
        }

    }]);