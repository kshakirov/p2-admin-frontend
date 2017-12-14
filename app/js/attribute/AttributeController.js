function createValidatorController(attr) {
    var attribute = attr;
    var ConverterModalController = function ($uibModalInstance, $scope,
                                             ConverterModel, NgTableParams) {
        var entity_type_uuid = 7,
            pageSize = 10,
            query = 'propertyName=role&propertyValues=base_search';

        $scope.search_params = {};

        $scope.init = function () {
            ConverterModel.findAll().then(function (converters) {
                $scope.converterTableParams = new NgTableParams({}, {dataset: converters});
            });
        };

        $scope.selectReference = function (id) {
            return ConverterModel.findOne(id).then(function (converter) {
                var result = {
                    converter: converter
                };
                $uibModalInstance.close(result);
            })
        };

        $scope.ok = function () {
            $uibModalInstance.close("Test");
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    };
    ConverterModalController.$inject = ['$uibModalInstance', '$scope',
        'ConverterModel', 'NgTableParams'];
    return ConverterModalController;
}

pimsApp.controller('AttributeController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'AttributeModel', 'MessageService', 'usSpinnerService',
    '$uibModal', 'AttributeService','ConverterModel','EntityTypeModel',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              AttributeModel,
              MessageService,
              usSpinnerService,
              $uibModal,
              AttributeService,
              ConverterModel,
              EntityTypeModel) {

        $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL", "INTEGER", "BOOLEAN",
            "REFERENCE", "ENUM"];
        $scope.frontendTypes = ["text", "number", "email", "password",
            "date", "select", "multiselect", "checkbox", "radio", "table"];

        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        $rootScope.message = MessageService.prepareMessage();

        $scope.init = function () {
            var uuid = $routeParams.uuid;
            if (uuid === "new") {
                usSpinnerService.stop('spinner-attribute');
            } else {
                AttributeModel.findOne(entity_type_uuid, uuid).then(function (attribute) {
                    ConverterModel.findAll().then(function (converters) {
                        EntityTypeModel.findAll().then(function (entity_types) {
                            usSpinnerService.stop('spinner-attribute');
                            $scope.entity_types = entity_types;
                            $scope.attribute = AttributeService.dtoAttribute(attribute, converters);
                        })
                    })
                })
            }
        };

        $scope.updateAttribute = function (attribute) {
            usSpinnerService.spin('spinner-attribute');
            var attribute_to_save = AttributeService.daoAttribute(attribute);
            if (attribute.uuid) {
                AttributeModel.update(entity_type_uuid, attribute_to_save).then(function (response) {
                    usSpinnerService.stop('spinner-attribute');
                    MessageService.setSuccessMessage($rootScope.message, "Attribute Updated");
                })
            } else {
                AttributeModel.create(entity_type_uuid, attribute_to_save).then(function (response) {
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

        $scope.addEnumValue = function () {
            if ($scope.attribute.properties.enumValues === null || angular.isUndefined($scope.attribute.properties.enumValues)) {
                $scope.attribute.properties.enumValues = [];
            }
            $scope.attribute.properties.enumValues.push('');
        }

        $scope.addValidator = function () {
            var attr = attr;
            var $uibModalInstance = modalInstance = $uibModal.open({
                templateUrl: 'partial/attribute/modal_validato',
                controller: createValidatorController(attr),
                resolve: {
                    user: function () {
                        return "Return";
                    }
                }
            });
            $uibModalInstance.result.then(function (selectedItem) {
                console.log(selectedItem);
                if (!$scope.attribute.properties.validators) {
                    $scope.attribute.properties.validators = [];
                }
                $scope.attribute.properties.validators.push(selectedItem.converter);
            }, function () {
            });

        };
        $scope.deleteValidator = function (index) {
            $scope.attribute.properties.validators.splice(index,1);
        }

    }]);