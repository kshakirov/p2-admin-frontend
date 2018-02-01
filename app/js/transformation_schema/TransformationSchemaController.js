pimsApp.controller('TransformationSchemaController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'TransformationSchemaModel',
    'TransformationSchemaService', 'EntityTypeModel', 'AttributeModel',
    'ConverterModel', 'MessageService', '$q', '$uibModal', '$timeout',
    '$ngConfirm',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              TransformationSchemaModel,
              TransformationSchemaService,
              EntityTypeModel,
              AttributeModel,
              ConverterModel,
              MessageService,
              $q,
              $uibModal,
              $timeout,
              $ngConfirm) {

        $rootScope.message = MessageService.prepareMessage();

        function isDto(schema) {
            return schema.customAttributes.dto;
        }

        function get_preproc_attributes(schema) {
            var pc = schema.schema.preprocSchema;
            if (pc && pc.length > 0) {
                var entity_type_id = pc[0].in[0].entityTypeId;
                if (entity_type_id) {
                    return AttributeModel.findAll(entity_type_id).then(function (attrs) {
                        return [entity_type_id, attrs];
                    }, function (error) {
                        return false;
                    })
                }
            }
            return $timeout(function () {
                return false;
            }, 0);
        }

        function upload_entity_type_attributes(ids) {
            var promises = ids.map(function (id) {
                return AttributeModel.findAll(id);
            });
            return $q.all(promises).then(function (attrs) {
                return attrs;
            })
        }

        var entity_type_id;
        $scope.preproc_entity_type_attrs = {};
        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {
                $scope.schema = {
                    customAttributes: {},
                    schema: {
                        schema: {}
                    }
                };
                $scope.transformation_schema = [];
                $scope.preproc_schema = [];
            } else {
                TransformationSchemaModel.findOne(id).then(function (schema) {

                    if (isDto(schema)) {
                        $scope.schema = TransformationSchemaService.useDto(schema);
                    }
                    else {
                        $scope.schema = TransformationSchemaService.importExportTransformationSchema(schema);
                    }


                    $scope.transformation_schema = schema.schema.schema || [];
                    $scope.preprocSchema = TransformationSchemaService.preprocSchema(schema.schema.preprocSchema,
                        schema) || [];
                    entity_type_id = schema.customAttributes.entity.uuid;
                    AttributeModel.findAll(entity_type_id).then(function (attributes) {
                        if (isDto(schema)) {
                            get_preproc_attributes(schema).then(function (preproc_promise) {
                                if (preproc_promise) {
                                    var prep_attrs = preproc_promise[1].map(function (pp) {
                                        pp.uuid = pp.uuid.toString();
                                        return pp
                                    });
                                    $scope.preproc_entity_type_attrs[preproc_promise[0]] = prep_attrs;
                                }
                                var entity_type_ids = TransformationSchemaService.getReferencedAttributes(attributes);
                                return upload_entity_type_attributes(entity_type_ids).then(function (attrs) {
                                    console.log(attrs);
                                    $scope.schema = TransformationSchemaService.prepChildAttrSelectors($scope.schema, attrs);
                                    $scope.attributes = attributes;
                                })
                            })

                        }
                        else {
                            $scope.attributes = attributes;
                        }

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
            schema.schema = {
                schema: TransformationSchemaService
                    .prepTransformationSchema($scope.transformation_schema,
                        $scope.schema.customAttributes.dto, $scope.attributes),
                preprocSchema: TransformationSchemaService
                    .prepPreProcSchema($scope.preprocSchema, schema)
            };
            if (schema.id)
                TransformationSchemaModel.update(schema).then(function () {
                    MessageService.setSuccessMessage($rootScope.message, "Schema Updated");
                }, function (error) {
                    MessageService.setDangerMessage($rootScope.message, "Failed: " + error.data.status.message);
                });
            else
                TransformationSchemaModel.save(schema).then(function () {
                    MessageService.setSuccessMessage($rootScope.message, "Schema  Created");
                });
            console.log($scope.schema.schema)
        };

        $scope.deleteTransformationSchema = function (id) {
            TransformationSchemaModel.delete(id).then(function () {
                MessageService.setWarningMessage($rootScope.message, "Schema  Deleted");
            });
        };

        $scope.addSchemaItem = function (out_attribute_name) {
            $scope.transformation_schema.push(
                TransformationSchemaService.addSchemaItem(out_attribute_name)
            )
        };

        $scope.addPreProcSchemaItem = function (out_attribute_name) {
            $scope.preprocSchema.push(
                TransformationSchemaService.addSchemaItemExport(out_attribute_name)
            )
        };

        $scope.addPreProcSchemaItemExport = function (out_attribute_name) {
            $scope.preprocSchema.push(
                TransformationSchemaService.addSchemaItemExport(out_attribute_name)
            )
        };

        $scope.removePreProcSchemaItem = function (index) {
            $scope.preprocSchema.splice(index, 1);
        };


        $scope.preprocEntityTypeChange = function (item, uuid) {
            if (!$scope.preproc_entity_type_attrs.hasOwnProperty(uuid)) {
                return AttributeModel.findAll(uuid).then(function (attrs) {
                    $scope.preproc_entity_type_attrs[uuid] = attrs;
                })
            }


        };


        $scope.addSchemaItemExport = function (out_attribute_name) {
            $scope.transformation_schema.push(
                TransformationSchemaService.addSchemaItemExport(out_attribute_name)
            )
        };

        $scope.removeSchemaItem = function (index) {
            $scope.transformation_schema.splice(index, 1);
        };

        $scope.removeInPathItem = function (item, index) {
            item.in.splice(index, 1);
        };

        $scope.addItemConverter = function (item) {
            TransformationSchemaService.addItemConverter(item)
        };

        $scope.removeItemConverter = function (item) {
            TransformationSchemaService.removeItemConverter(item)
        };

        $scope.addItemConst = function (item) {
            TransformationSchemaService.addItemConst(item)
        };

        $scope.removeItemConst = function (item, index) {
            item.default.splice(index, 1);
        };

        $scope.cancel = function () {
            $location.path("/transformation-schemata");
        };

        $scope.addItemAttribute = function (item) {
            TransformationSchemaService.addItemAttribute(item)
        };

        $scope.copyUUID = function (item) {
            item.out = item.in[0].uuid;
        };

        $scope.getPath = function (out) {
            var paths = out.split(".");
            return paths[0];
        };
        $scope.getAttribute = function (out) {
            var paths = out.split(".");
            return paths[1];
        };

        $scope.checkReference = function (value, item) {
            var reference_id = TransformationSchemaService.getReferencedEntity(value.uuid, $scope.attributes);
            value.root = 'attributes';
            if (reference_id) {
                console.log(reference_id);
                AttributeModel.findAll(reference_id).then(function (attributes) {
                    console.log(attributes);
                    item.reference = {
                        referenceId: reference_id,
                        uuid: null,
                        attributes: attributes
                    };
                })
            }
        };

        $scope.selectEntityType = function (uuid, old_uuid) {
            if (old_uuid && uuid != old_uuid) {
                $ngConfirm({
                    title: 'WARNING!',
                    content: "You Changed The Entity Type All Your Rules Must Be Revised",
                    buttons: {
                        changeType: {
                            text: 'YES',
                            btnClass: 'btn-red',
                            action: function () {
                            }
                        }
                    }
                });
            }
            AttributeModel.findAll(uuid).then(function (attributes) {
                $scope.attributes = attributes;
            })
        };

        $scope.addTransitiveReference = function (item) {
            // var item = item;
            var $uibModalInstance = modalInstance = $uibModal.open({
                templateUrl: 'partial/attribute/transitive_modal',
                controller: createTransitiveRefController(item, $scope.entity_types),
                resolve: {
                    user: function () {
                        return "Return";
                    }
                }
            });
            $uibModalInstance.result.then(function (reference) {
                console.log(reference);
                if (angular.isUndefined(item.in)) {
                    item.in = [];
                }
                item.in[0] = {
                    ref: reference,
                }
            }, function () {
            });

        };

    }]);