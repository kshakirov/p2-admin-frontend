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
    '$uibModal', 'AttributeService', 'ConverterModel', 'EntityTypeModel', '$timeout',
    'ngNotify', '$ngConfirm',
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
              EntityTypeModel,
              $timeout,
              ngNotify,
              $ngConfirm) {

        $scope.valueTypes = ["STRING", "ARRAY", "DECIMAL", "INTEGER", "BOOLEAN",
            "REFERENCE", "ENUM","BINARY_BASE64","BINARY_URL"];
        $scope.frontendTypes = ["text", "number", "email", "password",
            "date", "select", "multiselect", "checkbox", "radio", "table", "file", "preview",
            "image_url", "download"];
        $scope.analyzers = [{name: "Standard", code: "standard"}, {name: "Pims Custom", code: "pims_analyzer"}];
        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        $rootScope.message = MessageService.prepareMessage();

        function set_analyzer(attribute, analyzers) {
            if (angular.isUndefined(attribute.properties.analyzer) && attribute.valueType.toLowerCase() == 'string') {
                attribute.properties.analyzer = analyzers[1]
            }
        }

        $scope.init = function () {
            var uuid = $routeParams.uuid;

            if (uuid === "new") {
                ConverterModel.findAll().then(function (converters) {
                    EntityTypeModel.findAll().then(function (entity_types) {
                        $scope.attribute = {};
                        $scope.entity_types = entity_types;
                        usSpinnerService.stop('spinner-attribute');
                    })
                });
            } else {


                AttributeModel.findOne(entity_type_uuid, uuid).then(function (attribute) {
                    ConverterModel.findAll().then(function (converters) {
                        EntityTypeModel.findAll().then(function (entity_types) {
                            usSpinnerService.stop('spinner-attribute');
                            $scope.entity_types = entity_types;
                            $scope.attribute = AttributeService.dtoAttribute(attribute, converters);
                            set_analyzer($scope.attribute, $scope.analyzers);
                            usSpinnerService.stop('spinner-attribute');
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
                    ngNotify.set("Attribute Updated", 'success');

                })
            } else {
                AttributeModel.create(entity_type_uuid, attribute_to_save).then(function (response) {
                    usSpinnerService.stop('spinner-attribute');
                    ngNotify.set("Attribute Created", 'success');
                })
            }
        };

        $scope.deleteAttribute = function (uuid, attribute) {
            $ngConfirm({
                title: 'Are You Sure?',
                content: '',
                autoClose: 'cancel|8000',
                buttons: {
                    deleteUser: {
                        text: 'YES',
                        btnClass: 'btn-red',
                        action: function () {
                            AttributeModel.delete(entity_type_uuid, uuid).then(function (response) {
                                attribute.deleted = true;
                                ngNotify.set("Attribute Deleted", 'success');
                            })
                        }
                    },
                    cancel: function () {
                        $ngConfirm('CANCELED');
                    }
                }
            });

        };

        $scope.restoreAttribute = function (uuid, attribute) {
            attribute.deleted = false;
            $ngConfirm('Content here', 'Title here', $scope);
            AttributeModel.delete(entity_type_uuid, uuid).then(function (response) {
                attribute.deleted = true;
                ngNotify.set("Attribute Restored", 'success');
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
                templateUrl: 'partial/attribute/modal_validator',
                controller: createValidatorController(attr),
                resolve: {
                    user: function () {
                        return "Return";
                    }
                }
            });
            $uibModalInstance.result.then(function (selectedItem) {
                console.log(selectedItem);
                if (!$scope.attribute.properties) {
                    $scope.attribute.properties = {};
                }
                else if (!$scope.attribute.properties.validators) {
                    $scope.attribute.properties.validators = [];
                }
                $scope.attribute.properties.validators.push(selectedItem.converter);
            }, function () {
            });

        };
        $scope.deleteValidator = function (index) {
            $scope.attribute.properties.validators.splice(index, 1);
        };

        $scope.updateSearchSettings = function (attribute) {
            var data = {
                type: entity_type_uuid,
                analyzer: attribute.properties.analyzer.code,
                sorted: attribute.properties.sorted || false,
                attribute: attribute.uuid
            };
            console.log(attribute.properties.analyzer);
            console.log(attribute.properties.sorted);
            AttributeModel.searchUpdate(data).then(function (promise) {
                console.log(promise)
            }, function (error) {
                console.log(error)
            })
        }

    }]);