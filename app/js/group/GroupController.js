pimsApp.controller('GroupController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'GroupModel', 'MessageService',
    'UserModel', 'NgTableParams','GroupService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              GroupModel,
              MessageService,
              UserModel,
              NgTableParams,
              GroupService) {


        $rootScope.message = MessageService.prepareMessage();

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                UserModel.findAll().then(function (users) {
                    $scope.group = {};
                    $scope.tableParams = new NgTableParams({}, {dataset: users});
                    $scope.groupMembers = [];
                });

            } else {
                UserModel.findAll().then(function (users) {
                    $scope.tableParams = new NgTableParams({}, {dataset: users});
                    GroupModel.findOne(id).then(function (group) {
                        $scope.group = group;
                        $scope.groupMembers = GroupService.getMembers(group, users)
                        $scope.groupMembers = []
                    })
                });
            }
        };

        $scope.updateGroup = function (group, groupMembers) {
            var group = GroupService.daoGroup(group,groupMembers);
            if (group.id) {
                GroupModel.update(group).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Group Updated");
                })
            } else {
                GroupModel.create(group).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Group Created");
                })
            }
        };

        $scope.deleteGroup = function (id) {
            UserModel.delete(id).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/groups");
        };

        $scope.addMember = function (user) {
            $scope.groupMembers.push(user)
        }

    }]);