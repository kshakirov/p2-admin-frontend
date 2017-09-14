pimsApp.controller('ExternalOperationController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalOperationModel',
    'ExternalOperationService', 'EntityTypeModel', 'ConverterModel',
    'NgTableParams', 'TransformationSchemaModel',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              ExternalOperationModel,
              ExternalOperationService,
              EntityTypeModel,
              ConverterModel,
              NgTableParams,
              TransformationSchemaModel) {

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                ExternalOperationModel.createPipeline().then(function (external_operation) {
                    $scope.external_operation = external_operation;
                })
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
            var eo = ExternalOperationService.update_transformation_schemata(external_operation);
            if (external_operation.hasOwnProperty("id")) {
                ExternalOperationModel.save(eo.id, eo).then(function (response) {
                })
            } else {
                ExternalOperationModel.create(eo).then(function (response) {
                })
            }
        };
        $scope.deleteExternalOperation = function (id) {
            ExternalOperationModel.delete(id).then(function (response) {
            })
        };

        $scope.removeSchemaItem = function (key) {
            console.log(key);
            delete $scope.external_operation.transformationSchemata[key]
        };

        $scope.cancel = function () {
            $location.path("/external-operations");
        }
    }]);