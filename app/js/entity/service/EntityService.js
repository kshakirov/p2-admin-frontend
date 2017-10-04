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
            attributes_dto[attr.key.uuid] = attr.value;
        });
        return attributes_dto
    };

    this.prepMsg = function (msg, entity, entityTypeId) {
        msg.pimsId = entity.uuid;
        msg.entity_type_id = entityTypeId;
    }
}]);