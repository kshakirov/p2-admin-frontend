pimsApp.controller('ExternalOperationController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalOperationModel',
    'ExternalOperationService', 'EntityTypeModel', 'ConverterModel',
    'NgTableParams', 'TransformationSchemaModel', 'MessageService',
    'ExternalSystemModel', 'ngNotify',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              ExternalOperationModel,
              ExternalOperationService,
              EntityTypeModel,
              ConverterModel,
              NgTableParams,
              TransformationSchemaModel,
              MessageService,
              ExternalSystemModel,
              ngNotify) {

        $rootScope.message = MessageService.prepareMessage();
        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                ExternalSystemModel.findAll().then(function (external_systems) {
                    ExternalOperationModel.createPipeline().then(function (external_operation) {

                        $scope.external_operation = external_operation;
                        $scope.external_operation.sourceSystem = {
                            frontendInfo: {
                                options: external_systems,
                                type: "select",
                                selected: {}
                            }
                        };
                        $scope.external_operation.targetSystem = {
                            frontendInfo: {
                                options: external_systems,
                                type: "select",
                                selected: {}
                            }
                        };
                        $scope.external_operation.transformationSchemata = {};
                        TransformationSchemaModel.findAll().then(function (schemata) {
                            $scope.transformation_schemata = schemata;
                            EntityTypeModel.findAll().then(function (entity_types) {
                                $scope.entity_types = entity_types;
                                ExternalOperationService.dto_transformation_schemata(external_operation, schemata,
                                    entity_types)
                            });
                        });
                    });
                });

            } else {
                ExternalOperationModel.findOne(id).then(function (external_operation) {
                    $scope.external_operation = external_operation;
                    TransformationSchemaModel.findAll().then(function (schemata) {
                        $scope.transformation_schemata = schemata;
                        EntityTypeModel.findAll().then(function (entity_types) {
                            $scope.entity_types = entity_types;
                            ExternalOperationService.dto_transformation_schemata(external_operation, schemata,
                                entity_types)
                        });
                    });
                });
            }
        };

        $scope.changedEntityType = function (entity_type) {
            if (!$scope.external_operation.hasOwnProperty('transformationSchemata')) {
                $scope.external_operation.transformationSchemata = {}
            }
            $scope.external_operation
                .transformationSchemata[entity_type.uuid] = entity_type;
        };

        $scope.updateExternalOperation = function (external_operation) {
            if (ExternalOperationService.areSchemata_missed(external_operation)) {
                var missed = ExternalOperationService.areSchemata_missed(external_operation);
                ngNotify.set("Schemata Missed For [" + missed.join(',') + "]", 'error');
                return
            }
            var eo = ExternalOperationService.update_transformation_schemata(external_operation);
            ExternalOperationService.dto_external_systems(eo);
            ExternalOperationService.dto_entityTypes(eo);
            ExternalOperationService.hasNotConfiguredImmediatePipeline(external_operation).then(function (ok) {
                if (external_operation.hasOwnProperty("id")) {
                    ExternalOperationModel.save(eo.id, eo).then(function (response) {
                        ngNotify.set("Pipe Updated Successfully", 'success');
                    })
                } else {
                    ExternalOperationModel.create(eo).then(function (response) {
                        ngNotify.set("Pipe Created Successfully", 'success');
                    })
                }
            }, function (error) {
                var message = ExternalOperationService.prepErrorMessage(error);
                ngNotify.set("Not Properly Configured External Systems For Types" + message, {
                    position: 'top',
                    type: 'error',
                    sticky: true
                });
            });

        };
        $scope.deleteExternalOperation = function (id) {
            ExternalOperationModel.delete(id).then(function (response) {
                ngNotify.set("Pipe Deleted Successfully", 'success');
            })
        };

        $scope.removeSchemaItem = function (key) {
            console.log(key);
            delete $scope.external_operation.transformationSchemata[key]
        };

        $scope.cancel = function () {
            $location.path("/external-operations");
        };

        $scope.filterByEntityTypeId = function (transformation_schemata, entity_type_id) {
            if (transformation_schemata) {
                return transformation_schemata.filter(function (s) {
                    if (s.customAttributes.entity.uuid == entity_type_id)
                        return true;
                })
            } else {
                return []
            }
        }
    }]);