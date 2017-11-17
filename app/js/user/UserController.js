pimsApp.controller('UserController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'UserModel', 'MessageService',
    'GroupModel','RoleModel','$q','NgTableParams', 'UserService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              UserModel,
              MessageService,
              GroupModel,
              RoleModel,
              $q,
              NgTableParams,
              UserService) {


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
                    $scope.rolesTableParams = new NgTableParams({}, {dataset: promises[1]}) ;
                    $scope.userRoles= [];
                });
            } else {
                loadAll(id).then(function (promises) {

                    $scope.rolesTableParams = new NgTableParams({}, {dataset: promises[1]}) ;
                    $scope.user = promises[2]
                    $scope.userRoles= UserService.getUserRoles(promises[2], promises[1]);
                    var userGroups = UserService.getUserGroupes(promises[2], promises[0]);
                    $scope.groupsTableParams =new NgTableParams({}, {dataset: userGroups}) ;

                })
            }
        };

        $scope.updateUser = function (user,roles) {
            var user = UserService.daoUser(user,roles);
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
        
        $scope.addRole = function (role) {
            $scope.userRoles.push(role)
        }

        $scope.deleteUserRole = function (index) {
            $scope.userRoles.splice(index, 1);
        }

    }]);