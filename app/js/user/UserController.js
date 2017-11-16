pimsApp.controller('UserController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'UserModel', 'MessageService',
    'GroupModel','RoleModel','$q',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              UserModel,
              MessageService,
              GroupModel,
              RoleModel,
              $q) {


        $rootScope.message = MessageService.prepareMessage();

        function loadDependencies() {
            return $q.all([GroupModel.findAll(),RoleModel.findAll()])
        }

        function loadAll(id) {
            return $q.all([GroupModel.findAll(),RoleModel.findAll(),UserModel.findOne(id)])
        }

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                loadDependencies().then(function (promises) {
                    $scope.user = {};
                    $scope.groups = promises[0];
                    $scope.roles = promises[1]
                });
            } else {
                loadAll(id).then(function (promises) {
                    $scope.user = promises[2];
                    $scope.groups = promises[0];
                    $scope.roles = promises[1]
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