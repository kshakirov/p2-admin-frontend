pimsApp.controller('EntityController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'EntityModel', 'EntityService',
    'AttributeSetModel', 'NotificationModel', 'MessageService', '$uibModal',
    '$q', 'ConverterModel', 'usSpinnerService', 'Upload', 'FileSaver', 'AttachmentService',
    'ngNotify',
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
              usSpinnerService,
              Upload,
              FileSaver,
              AttachmentService,
              ngNotify) {

        var entity_type_uuid = $rootScope.pims.entities.current.uuid,
            msg = {
                "name": "PERFORM_ENTITY_SYNCHRONIZATION",
                "pimsId": null,
                "entity_type_id": null,
                "syncOperationType": "UPDATE"
            };

        var old_entity = {};

        $rootScope.message = MessageService.prepareMessage();


        function compare_tabs(tab1, tab2) {
            var diff = tab1.properties.order - tab2.properties.order;
            return diff;
        }

        function order_tabs(tabs) {
            var t = tabs.sort(compare_tabs);
            return t;
        }

        function is_entity_changed(response) {
            return response.status!=304
        }

        function create_q_functions(reference_array_attributes, reference_attributes) {
            var q_functions = {},
                params_string = "propertyName=role&propertyValues=table";
            reference_array_attributes.map(function (ra) {
                q_functions[ra.uuid] = AttributeSetModel.search(ra.entity_type_id, params_string);
            });
            params_string = "propertyName=role&propertyValues=reference_name";
            reference_attributes.map(function (ra) {
                q_functions[ra.uuid] = AttributeSetModel.search(ra.entity_type_id, params_string);
            });

            return q_functions;
        }


        $scope.init = function () {
            var uuid = $routeParams.uuid;
            var params_string = "propertyName=role&propertyValues=tab";
            if (uuid === "new") {
                EntityModel.createTemplate(entity_type_uuid).then(function (template) {
                    AttributeSetModel.search(entity_type_uuid, params_string).then(function (tabs) {
                        var reference_array_attributes = EntityService.getReferenceArrayAttributes(tabs);
                        var reference_attributes = EntityService.getReferenceAttributes(tabs);
                        $q.all(create_q_functions(reference_array_attributes, reference_attributes)).then(function (promises) {
                            $scope.reference_tables = promises;
                            $scope.tabs = order_tabs(tabs);
                            $scope.entity = template;
                            $scope.audit = "Audit";
                            $scope.active = 0;
                            usSpinnerService.stop('spinner-entity');
                        })
                    })
                })

            } else {

                EntityModel.findOne(entity_type_uuid, uuid).then(function (entity) {
                    AttributeSetModel.search(entity_type_uuid, params_string).then(function (tabs) {
                        var reference_array_attributes = EntityService.getReferenceArrayAttributes(tabs);
                        var reference_attributes = EntityService.getReferenceAttributes(tabs);
                        $q.all(create_q_functions(reference_array_attributes, reference_attributes)).then(function (promises) {
                            EntityModel.getAttachmentInfo(uuid).then(function (info) {
                                console.log(info);
                                if (info) {
                                    $scope.preview_available = AttachmentService.preview(info);
                                }
                                $scope.reference_tables = promises;
                                $scope.tabs = order_tabs(tabs);
                                $scope.entity = entity;
                                $scope.audit = "Audit";
                                $scope.active = 0;
                                usSpinnerService.stop('spinner-entity');
                                angular.copy(entity, old_entity);
                            })

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
                if (validation.result) {
                    if (entity.uuid) {
                        EntityModel.update(entity_type_uuid, entity_copy).then(function (response) {
                            if(is_entity_changed(response)) {
                                EntityService.prepDiffMsg(msg, response);
                                NotificationModel.notifyEntity(msg).then(function () {
                                    ngNotify.set("Entity Updated", 'success');
                                })
                            }else {
                                ngNotify.set("Entity Not Changed", 'warning');
                            }
                        }, function (error) {
                            ngNotify.set("Entity Is Not Updated" + error.msg, 'error');
                        })
                    } else {
                        EntityModel.create(entity_type_uuid, entity_copy).then(function (response) {
                            EntityService.prepCreateMsg(msg, response, entity_type_uuid);
                            ngNotify.set("Entity Created", 'success');
                            NotificationModel.notifyEntity(msg).then(function () {
                                ngNotify.set("Entity Updated", 'success');
                            })
                        }, function (error) {
                            ngNotify.set("Entity Is Not Created" + error.msg, 'error');
                        });
                    }
                } else {
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


        $scope.uploadFile = function (file) {
            AttachmentService.upload(file, $scope.entity.uuid).then(function () {
                MessageService.setSuccessMessage($rootScope.message,
                    "File  is loaded");
            })
        };

        $scope.uploadFromUrl = function (url, id) {
            if (id) {
                EntityModel.attachmentUpdateUploadUrl(id, url).then(function (resp) {
                    MessageService.setSuccessMessage($rootScope.message,
                        "Attachment is loaded")
                })
            } else {
                MessageService.setDangerMessage($rootScope.message, "You must first create the attachment");
            }
        };


        $scope.download = function (uuid) {
            EntityModel.getAttachmentInfo(uuid).then(function (info) {
                console.log(info);
                _download(uuid, info.contentType, info.filename)
            }, function (errror) {
                console.log(error)
            })
        };


        function _download(uuid, fileType, fileName) {
            console.log(fileName);
            $http({
                url: '/rest/binary/' + uuid,
                method: "GET",
                data: {
                    filename: "file"
                },
                responseType: 'blob'
            }).then(function (data) {
                var blob = new Blob([data.data], {type: fileType});

                FileSaver.saveAs(blob, fileName)
            }, function (data) {
                if (data.status == 404) {
                    MessageService.setDangerMessage($rootScope.message, "The File '" + fileName + "' Does Not Exist");
                } else {
                    console.log('Unable to download the file')
                }

            });
        }


    }]);


