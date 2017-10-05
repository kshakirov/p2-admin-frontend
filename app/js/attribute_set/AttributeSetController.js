pimsApp.controller('AttributeSetController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'AttributeSetModel', 'AttributeModel',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              AttributeSetModel,
              AttributeModel) {

        var entity_type_uuid = $rootScope.pims.entities.current.uuid;

        function _map_attributes_to_ids(attribute_set_copy) {
            var attributes = attribute_set_copy.attributes.map(function(attribute){
                return attribute.uuid
            });
            delete attribute_set_copy.attributes;
            attribute_set_copy.attributeIds = attributes;
        };

        function _entitty_dto_2_entry(attribute_set_copy) {
            if(attribute_set_copy.hasOwnProperty("entityType")) {
                var entityTypeId = attribute_set_copy.entityType.uuid;
                delete attribute_set_copy.entityType;
                attribute_set_copy.entityTypeId = entityTypeId;
            }else{
                attribute_set_copy.entityTypeId = entity_type_uuid;
            }
        }

        function _dto_2_entry(attribute_set) {
            var attribute_set_copy = {};
            angular.copy(attribute_set, attribute_set_copy);
            _map_attributes_to_ids(attribute_set_copy);
            _entitty_dto_2_entry(attribute_set_copy);
            return attribute_set_copy;
        }

        $scope.init = function () {
            var uuid = $routeParams.uuid;
            if (uuid === "new") {
                $scope.attribute_set = {
                    attributes: [],
                }
            } else {
                AttributeSetModel.findOne(entity_type_uuid, uuid).then(function (attribute_set) {
                    $scope.attribute_set = attribute_set;
                })
            }
        };

        $scope.initAttributes = function () {
            AttributeModel.findAll(entity_type_uuid).then(function(attributes) {
                $scope.attributes = attributes;
            })

        };

        $scope.saveAttributeSet = function (attribute_set) {
            if(attribute_set.uuid) {
                AttributeSetModel.update(entity_type_uuid,
                    _dto_2_entry(attribute_set)).then(function (response) {
                })
            }else{
                AttributeSetModel.create(entity_type_uuid,
                    _dto_2_entry(attribute_set)).then(function (response) {
                })
            }
        };

        $scope.createAttributeSet = function (attribute_set) {
            AttributeSetModel.save(entity_type_uuid,
                _dto_2_entry(attribute_set)).then(function(response) {
            })
        };

        $scope.deleteAttributeSet = function (uuid) {
            AttributeSetModel.delete(entity_type_uuid, uuid).then(function (response) {
            })
        };

        $scope.deleteAttribute = function (index) {
            $scope.attribute_set.attributes.splice(index, 1);
        };

        $scope.addAttribute = function (attribute) {
            $scope.attribute_set.attributes.push(attribute);
        };

        $scope.cancel = function () {
            $location.path("/attribute-sets");
        }

    }]);
