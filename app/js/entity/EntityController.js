pimsApp.controller('EntityController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'EntityModel', 'EntityService',
    'AttributeSetModel', 'NotificationModel', 'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              EntityModel,
              EntityService,
              AttributeSetModel,
              NotificationModel,
              MessageService) {

        var entity_type_uuid = $rootScope.pims.entities.current.uuid,
            msg = {
                "name": "PERFORM_ENTITY_SYNCHRONIZATION",
                "pimsId": null,
                "entity_type_id": null,
                "syncOperationType": "UPDATE"
            };

        $rootScope.message = MessageService.prepareMessage();


        $scope.init = function () {
            var uuid = $routeParams.uuid;
            var params_string = "propertyName=role&propertyValues=tab";
            if (uuid === "new") {
                EntityModel.createTemplate(entity_type_uuid).then(function (template) {
                    AttributeSetModel.search(entity_type_uuid, params_string).then(function (tabs) {
                        $scope.tabs = tabs;
                        $scope.entity = template;
                    })
                })

            } else {

                EntityModel.findOne(entity_type_uuid, uuid).then(function (entity) {
                    AttributeSetModel.search(entity_type_uuid, params_string).then(function (tabs) {
                        $scope.tabs = tabs;
                        $scope.entity = entity;
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
            if (entity.uuid) {
                EntityModel.update(entity_type_uuid, entity_copy).then(function (response) {
                    EntityService.prepMsg(msg, entity, entity_type_uuid);
                    NotificationModel.notifyEntity(msg).then(function () {
                        MessageService.setSuccessMessage($rootScope.message,
                            "Entity Updated and Changed Synced to Other Systems")
                    })
                }, function (error) {
                })
            } else {
                EntityModel.create(entity_type_uuid, entity_copy).then(function (response) {
                    EntityService.prepMsg(msg, entity, entity_type_uuid);
                    MessageService.setSuccessMessage($rootScope.message,
                        "Entity Updated and Changed Synced to Other Systems")
                });
            }
        };

        $scope.deleteEntity = function (uuid) {
            EntityModel.delete(entity_type_uuid, uuid).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/entities");
        }

    }]);