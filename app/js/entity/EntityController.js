pimsApp.controller('EntityController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'EntityModel', 'EntityService',
    'AttributeSetModel', 'NotificationModel', 'MessageService', '$uibModal',
    '$q', 'ConverterModel','usSpinnerService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              EntityModel,
              EntityService,
              AttributeSetModel,
              NotificationModel,
              MessageService,
              $uibModal,
              $q,
              ConverterModel,
              usSpinnerService) {

        var entity_type_uuid = $rootScope.pims.entities.current.uuid,
            msg = {
                "name": "PERFORM_ENTITY_SYNCHRONIZATION",
                "pimsId": null,
                "entity_type_id": null,
                "syncOperationType": "UPDATE"
            };


        $rootScope.message = MessageService.prepareMessage();


        function compare_tabs(tab1, tab2) {
            var diff = tab1.properties.order - tab2.properties.order;
            return diff;
        }

        function order_tabs(tabs) {
            var t = tabs.sort(compare_tabs)
            return t;
        }

        function create_q_functions(reference_array) {
            var q_functions = {},
                params_string = "propertyName=role&propertyValues=table";
            reference_array.map(function (ra) {
                q_functions[ra.uuid] = AttributeSetModel.search(ra.entity_type_id, params_string);
            })
            return q_functions;
        }


        $scope.init = function () {
            var uuid = $routeParams.uuid;
            var params_string = "propertyName=role&propertyValues=tab";
            if (uuid === "new") {
                EntityModel.createTemplate(entity_type_uuid).then(function (template) {
                    AttributeSetModel.search(entity_type_uuid, params_string).then(function (tabs) {
                        var reference_array = EntityService.getReferenceArrayAttributes(tabs);
                        $scope.tabs = order_tabs(tabs);
                        $scope.entity = template;
                    })
                })

            } else {

                EntityModel.findOne(entity_type_uuid, uuid).then(function (entity) {
                    AttributeSetModel.search(entity_type_uuid, params_string).then(function (tabs) {
                        var reference_array = EntityService.getReferenceArrayAttributes(tabs);
                        $q.all(create_q_functions(reference_array)).then(function (promises) {
                            console.log(promises);
                            $scope.reference_tables = promises;
                            $scope.tabs = order_tabs(tabs);
                            $scope.entity = entity;
                            usSpinnerService.stop('spinner-entity');
                        });

                    })
                })
            }
        };

        $scope.updateEntity = function (entity) {
            var entity_copy = {};
            angular.copy(entity, entity_copy);
            entity_copy.attributes = EntityService.prepAttributesDto(entity.attributes);
            entity_copy.entityTypeId = EntityService.prepEntityTypeId(entity);
            delete entity_copy.entityType;
            validateAttributes(entity).then(function (validation_data) {
                var validation = EntityService.processValidationData(validation_data, entity);
                if(validation.result) {
                    if (entity.uuid) {
                        EntityModel.update(entity_type_uuid, entity_copy).then(function (response) {
                            EntityService.prepMsg(msg, entity, entity_type_uuid);
                            NotificationModel.notifyEntity(msg).then(function () {
                                MessageService.setSuccessMessage($rootScope.message,
                                    "Entity Updated")
                            })
                        }, function (error) {
                        })
                    } else {
                        EntityModel.create(entity_type_uuid, entity_copy).then(function (response) {
                            EntityService.prepMsg(msg, entity, entity_type_uuid);
                            MessageService.setSuccessMessage($rootScope.message,
                                "Entity Created ")
                        });
                    }
                }else {
                    MessageService.setDangerMessage($rootScope.message,
                        validation.message);
                }
            }, function (error) {
                console.log(error);
            })

        };

        $scope.deleteEntity = function (uuid) {
            EntityModel.delete(entity_type_uuid, uuid).then(function (response) {
            })
        };


        $scope.replaceReference = function (entity, attribute_id, new_value) {
            entity.attributes[attribute_id].value = new_value;
        };

        $scope.addReference = function (entity, attribute_id, new_value) {
            entity.attributes[attribute_id].value.push(new_value);
        };

        $scope.removeReference = function (attr, index) {
            $scope.entity.attributes[attr.uuid].value.splice(index, 1);
        };


        $scope.open = function (attr, callback) {
            console.log('opening pop up');
            var attr = attr;
            $scope.selected_reference = null;
            var $uibModalInstance = modalInstance = $uibModal.open({
                templateUrl: 'partial/entity/modal_category',
                controller: createController(attr),
                resolve: {
                    user: function () {
                        return "Return";
                    }
                }
            });
            $uibModalInstance.result.then(function (selectedItem) {
                console.log(selectedItem);
                callback($scope.entity, selectedItem.attribute_id, selectedItem.entityData);
            }, function () {
            });

        };

        $scope.cancel = function () {
            $location.url("/entities");
        };

        function validateAttributes(entity) {
            var keys = Object.keys(entity.attributes);
            var attrs_to_validate = keys.filter(function (key) {
                var p = entity.attributes[key].key.properties.validators;
                if (p && p.length > 0) {
                    return key;
                }
            });
            attrs_to_validate = attrs_to_validate.map(function (key) {
                var a = entity.attributes[key].value,
                    p = entity.attributes[key].key.properties.validators;
                return {
                    validatorId: p[0],
                    value: a,
                    id: entity.attributes[key].key.name
                }
            });
            return ConverterModel.validate(attrs_to_validate);
        }


    }]);


