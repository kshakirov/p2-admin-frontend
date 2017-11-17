pimsApp.controller('AttributeListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'AttributeModel', 'NgTableParams',
    'MessageService',
    function ($scope, $route, $routeParams,
                                                                                     $location,
                                                                                     $http,
                                                                                     $rootScope,
                                                                                     AttributeModel,
                                                                                     NgTableParams,
              MessageService) {
        $rootScope.message = MessageService.prepareMessage();
        $scope.init = function () {
            var entity_type_uuid = $rootScope.pims.entities.current.uuid;
            AttributeModel.findAll(entity_type_uuid).then(function (attributes) {
                $scope.tableParams = new NgTableParams({}, {dataset: attributes});
            }, function (error) {
                MessageService.setDangerMessage($rootScope.message,
                    "You are not authorized");
            });
        };

        $scope.createAttribute = function () {
            $location.path("/attributes/new");
        }


    }]);