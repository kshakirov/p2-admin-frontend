pimsApp.controller('UserListController', [ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'UserModel', 'NgTableParams',function ($scope, $route, $routeParams,
                                                                                     $location,
                                                                                     $http,
                                                                                     $rootScope,
                                                                                     UserModel,
                                                                                     NgTableParams) {
        $scope.init = function () {
            UserModel.findAll().then(function (users) {
                $scope.tableParams = new NgTableParams({}, {dataset: users});
            });
        };

        $scope.createUser = function () {
            $location.path("/users/new");
        }


    }]);