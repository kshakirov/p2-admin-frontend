pimsApp.controller('TransformationSchemaController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'TransformationSchemaModel',
    'TransformationSchemaService', 'EntityTypeModel', 'AttributeModel',
    'ConverterModel',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              TransformationSchemaModel,
              TransformationSchemaService,
              EntityTypeModel,
              AttributeModel,
              ConverterModel) {

        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                $scope.schema = {
                    customAttributes: {}
                };
                $scope.transformation_schema =  [];
            } else {
                TransformationSchemaModel.findOne(id).then(function (schema) {
                    $scope.schema = schema;
                    $scope.transformation_schema = schema.schema.schema || [];
                    var entity_type_id = schema.customAttributes.entity.uuid;
                    AttributeModel.findAll(entity_type_id).then(function (attributes) {
                        $scope.attributes = attributes;
                    });
                    ConverterModel.findAll().then(function (converters) {
                        $scope.converters = converters;
                    })
                })
            }
            EntityTypeModel.findAll().then(function (entity_types) {
                $scope.entity_types = entity_types;
            })
        };
        
        $scope.updateTransformationSchema = function (schema) {
            schema.schema ={
                schema: TransformationSchemaService
                .prepTransformationSchema($scope.transformation_schema)
            };
            if(schema.id)
                TransformationSchemaModel.update(schema).then(function () {
            });
            else
                TransformationSchemaModel.save(schema).then(function () {
                });
        };

        $scope.addSchemaItem = function (out_attribute_name) {
            $scope.transformation_schema.push(
                TransformationSchemaService.addSchemaItem(out_attribute_name)
            )
        };

        $scope.removeSchemaItem = function (index) {
            $scope.transformation_schema.splice(index,1);
        };

        $scope.addItemConverter = function (item) {
            TransformationSchemaService.addItemConverter(item)
        };

        $scope.cancel = function () {
            $location.path("/transformation-schemata");
        };

        $scope.addItemAttribute = function (item) {
            TransformationSchemaService.addItemAttribute(item)
        };

        $scope.copyUUID = function (item) {
            item.out = item.in[0].uuid;
        }

    }]);