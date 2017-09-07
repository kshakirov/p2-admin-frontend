pimsApp.controller('ExternalOperationController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ExternalOperationModel',
    'ExternalOperationService', 'EntityTypeModel', 'ConverterModel',
    'NgTableParams',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              ExternalOperationModel,
              ExternalOperationService,
              EntityTypeModel,
              ConverterModel,
              NgTableParams) {

        $scope.reloaded = true;
        $scope.init = function () {
            var id = $routeParams.id;
            $scope.triplesArray = [];
            if (id === "new") {
                ExternalOperationModel.createPipeline().then(function (external_operation) {
                    $scope.external_operation = external_operation;
                })
            } else {
                ExternalOperationModel.findOne(id).then(function (external_operation) {
                    $scope.external_operation = external_operation;
                });
                EntityTypeModel.findAll().then(function (entity_types) {
                    $scope.entity_types = entity_types;
                });
                ConverterModel.findAll().then(function (converters) {
                    $scope.converters = converters;
                })
            };
            $scope.converterAttributeTableParams = new NgTableParams({}, {dataset: $scope.triplesArray});
        };

        $scope.changedEntityType = function (entity_type) {
            ExternalOperationService.initAttributes(entity_type.uuid).then(function (attributes) {
                $scope.attributes = attributes;
            })
        }

        $scope.updateExternalOperation = function (external_operation) {
            ExternalOperationService.update_external_system(external_operation);
            if (external_operation.hasOwnProperty("id")) {
                ExternalOperationModel.save(external_operation.id, external_operation).then(function (response) {
                })
            } else {
                ExternalOperationModel.create(external_operation).then(function (response) {
                })
            }
        };
        $scope.deleteExternalOperation = function (id) {
            ExternalOperationModel.delete(id).then(function (response) {
            })
        };
        $scope.cancel = function () {
            $location.path("/external-operations");
        }

        $scope.addConverterTriple = function (entity, attribute, converter) {
            $scope.reloaded = false;
            $scope.triplesArray.push(ExternalOperationService
                .createTripleArrayEntry(entity, attribute, converter));
            $scope.converterAttributeTableParams = new NgTableParams({}, {dataset: $scope.triplesArray});
            $scope.reloaded = true;
        }
    }]);