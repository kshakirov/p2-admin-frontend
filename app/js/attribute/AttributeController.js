pimsApp.controller('AttributeController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'AttributeModel', 'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              AttributeModel,
              MessageService) {

        $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL", "INTEGER", "BOOLEAN"];
        $scope.frontendTypes = ["text", "number", "email", "password",
            "date", "select", "multiselect", "checkbox", "radio"];
        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        $rootScope.message = MessageService.prepareMessage();

        $scope.init = function () {
            var uuid = $routeParams.uuid;
            if (uuid === "new") {

            } else {
                AttributeModel.findOne(entity_type_uuid, uuid).then(function (attribute) {
                    $scope.attribute = attribute;
                })
            }
        };

        $scope.updateAttribute = function (attribute) {
            if (attribute.uuid) {
                AttributeModel.update(entity_type_uuid, attribute).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Attribute Updated");
                })
            } else {
                AttributeModel.create(entity_type_uuid, attribute).then(function (response) {
                    MessageService.setSuccessMessage($rootScope.message, "Attribute Created");
                })
            }
        };

        $scope.deleteAttribute = function (uuid) {
            AttributeModel.delete(entity_type_uuid, uuid).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/attributes");
        }

    }]);