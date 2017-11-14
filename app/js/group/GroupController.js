pimsApp.controller('GroupController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'GroupModel', 'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              GroupModel,
              MessageService) {


        $rootScope.message = MessageService.prepareMessage();

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {

            } else {
                GroupModel.findOne(id).then(function (user) {
                    $scope.attribute = user;
                })
            }
        };

        $scope.updateGroup = function (groups) {
            if (groups.id) {
                GroupModel.update(groups).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Group Updated");
                })
            } else {
                GroupModel.create(groups).then(function (response) {
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
        }

    }]);