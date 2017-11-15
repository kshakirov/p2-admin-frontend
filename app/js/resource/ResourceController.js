pimsApp.controller('ResourceController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ResourceModel', 'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              ResourceModel,
              MessageService) {


        $rootScope.message = MessageService.prepareMessage();
        $scope.modules = [{id:1, name: "Metadata"},{id:2, name: "Sync Module"}];

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {

            } else {
                ResourceModel.findOne(id).then(function (roles) {
                    $scope.roles = roles;
                })
            }
        };

        $scope.updateResource = function (resource) {
            if (resource.id) {
                ResourceModel.update(resource).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Resource Updated");
                })
            } else {
                ResourceModel.create(resource).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Resource Created");
                })
            }
        };

        $scope.deleteResource = function (id) {
            ResourceModel.delete(id).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/roles");
        }

    }]);