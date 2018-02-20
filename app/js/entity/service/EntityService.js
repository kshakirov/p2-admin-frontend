pimsServices.service('EntityService', ['$http', '$rootScope', 'uuid4', function ($http, $rootScope, uuid4) {
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

    function _prep_msg(msg, entity) {
        msg.pimsId = entity.uuid;
        msg.entity_type_id = entity.entityTypeId;
        msg.requestId = uuid4.generate();
    }

    this.prepMsg = function (msg, entity, entityTypeId) {
        _prep_msg(msg, entity, entityTypeId)
    };

    this.prepDiffMsg = function (msg,response) {
        _prep_msg(msg, response.entity);
        msg.diff = response.diff;
        msg.version = response.entity.version;
    };

    this.prepCreateMsg = function (msg, entity, entityTypeId) {
        _prep_msg(msg, entity, entityTypeId);
        msg.syncOperationType = "CREATE";
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

    };

    this.getReferenceAttributes = function (tabs) {
        var attrs = tabs.map(function (tab) {
            return tab.attributes;
        });
        attrs = [].concat.apply([], attrs);
        var reference_array = attrs.filter(function (a) {
            if (a.valueType.toLowerCase() === "reference") {
                return a;
            }
        }).map(function (ra) {
            return {
                uuid: ra.uuid,
                entity_type_id: ra.properties.referencedEntityTypeId
            };
        });
        return reference_array;

    };

    this.processValidationData = function (validation_data, entity) {
        var failed = validation_data.result.filter(function (r) {
            if (!r.result) {
                return r;
            }
        });
        var message = failed.map(function (f) {
            return "Attribute [" + f.id + "]  Failed On Validator [" + f.validatorName + "]"
        });
        message.join("; ");
        return {
            result: failed.length > 0 ? false : true,
            failed: failed,
            message: message
        }
    };

    function find_attr_uuid_by_name(name, attributes) {
        var attr = attributes.find(function (a) {
            if (a.name == name) {
                return a
            }
        });
        return attr.uuid;
    }

    function merge_tab_attributes(tabs) {
        var attributes = [];
        tabs.map(function (t) {
            attributes = attributes.concat(t.attributes)
        });
        return attributes;
    };

    this.getAttributeValueByName = function (entity, tabs, name) {
        var attributes = attributes = merge_tab_attributes(tabs);
        var uuid = find_attr_uuid_by_name(name, attributes);
        return entity.attributes[uuid].value
    };

    this.fillAttachmentData = function (response, entity, tabs) {
        var response = response.data,
            attributes = merge_tab_attributes(tabs),
            names = ['Id', 'File Name', 'Size', 'Content Type'],
            response_names = ['uuid', 'name', 'size', 'contentType'];
        names.map(function (n, index) {
            var id = find_attr_uuid_by_name(n, attributes);
            entity.attributes[id].value = response[response_names[index]];
        })
    }
}]);