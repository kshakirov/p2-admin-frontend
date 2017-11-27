pimsApp.controller('AttributeController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'AttributeModel', 'MessageService','usSpinnerService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              AttributeModel,
              MessageService,
              usSpinnerService) {

        $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL", "INTEGER", "BOOLEAN",
            "REFERENCE", "ENUM"];
        $scope.frontendTypes = ["text", "number", "email", "password",
            "date", "select", "multiselect", "checkbox", "radio"];

        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        $rootScope.message = MessageService.prepareMessage();

        $scope.init = function () {
            var uuid = $routeParams.uuid;
            if (uuid === "new") {
                usSpinnerService.stop('spinner-attribute');
            } else {
                AttributeModel.findOne(entity_type_uuid, uuid).then(function (attribute) {
                    usSpinnerService.stop('spinner-attribute');
                    $scope.attribute = attribute;
                })
            }
        };

        $scope.updateAttribute = function (attribute) {
            usSpinnerService.spin('spinner-attribute');
            if (attribute.uuid) {
                AttributeModel.update(entity_type_uuid, attribute).then(function (response) {
                    usSpinnerService.stop('spinner-attribute');
                    MessageService.setSuccessMessage($rootScope.message, "Attribute Updated");
                })
            } else {
                AttributeModel.create(entity_type_uuid, attribute).then(function (response) {
                    usSpinnerService.stop('spinner-attribute');
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