pimsServices.service('EntityService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.filterSimpleAttributes = function (attributes) {
        var keys = Object.keys(attributes),
            attrs = [];
        keys.map(function (key) {
            var v_type = attributes[key].key.valueType.toLowerCase(),
                result = {
                    key: key,
                    value: attributes[key].value,
                    name: attributes[key].key.name
                };

            if (v_type === "string") {
                result.type = 'text';
                attrs.push(result);
            } else if (v_type === "integer") {
                result.type = 'number';
                attrs.push(result);
            }
        });
        return attrs;
    };
    this.prepAttributesDto = function (attriubtes) {
        var attributes_dto = {};
        angular.forEach(attriubtes, function (attr, value) {
            if (angular.isArray(attr.value)) {
                if (attr.value[0] && attr.value[0].hasOwnProperty("uuid")) {
                    attributes_dto[attr.key.uuid] = attr.value.filter(function (item) {
                        if (item && item.hasOwnProperty('uuid')) {
                            return item;
                        }
                    });
                    attributes_dto[attr.key.uuid] = attributes_dto[attr.key.uuid].map(function (item) {
                        return item.uuid;
                    });
                } else
                    attributes_dto[attr.key.uuid] = [];
            }
            else if (angular.isObject(attr.value))
                attributes_dto[attr.key.uuid] = attr.value.uuid;
            else
                attributes_dto[attr.key.uuid] = attr.value;
        });
        return attributes_dto
    };

    this.prepEntityTypeId = function (entity) {
        return entity.entityType.uuid;
    };

    this.prepMsg = function (msg, entity, entityTypeId) {
        msg.pimsId = entity.uuid;
        msg.entity_type_id = entityTypeId;
    };

    this.getReferenceArrayAttributes = function (tabs) {
        var attrs = tabs.map(function (tab) {
            return tab.attributes;
        });
        attrs = [].concat.apply([], attrs);
        console.log("done");
        var reference_array = attrs.filter(function (a) {
            if (a.valueType.toLowerCase() === "array") {
                return a;
            }
        }).map(function (ra) {
            return {
                uuid: ra.uuid,
                entity_type_id: ra.properties.referencedEntityTypeId
            };
        });
        return reference_array;

    }

    this.processValidationData = function (validation_data,entity ) {
        var failed = validation_data.result.filter(function (r) {
            if(!r.result){
                return r;
            }
        });
        var message = failed.map(function (f) {
            return "Attribute [" + f.id + "]  Failed On Validator ["+ f.validatorName + "]"
        });
        message.join("; ");
        return {
            result: failed.length > 0 ? false: true,
            failed: failed,
            message: message
        }
    }
}]);