pimsServices.service('AdvancedSearchService', ['$http', function ($http) {
    this.getReferences = function (attributes) {
        var keys = Object.keys(attributes);
        var references = keys.filter(function (key) {
            if (attributes[key].valueType.toLowerCase() == 'reference') {
                return true;
            }
        });

        references = references.map(function (r) {
            return {
                attributeId: attributes[r].uuid,
                entityTypeId: attributes[r].properties.referencedEntityTypeId
            };
        });
        return references;
    };

    this.getFields = function (attributes) {
        var keys = Object.keys(attributes);
        var fields = keys.map(function (key) {
            return attributes[key].uuid
        });
        return fields;
    };
    this.prepReferencesName = function (referencesName) {
        var r_ns = {},
            r_c_ns = {},
            keys = Object.keys(referencesName);
        keys.map(function (key) {
            if (referencesName[key].length > 0 && referencesName[key][0].attributes.length > 0) {
                r_ns[key] = referencesName[key][0].attributes[0].uuid.toString();
            } else {
                return false;
            }
        });
        Object.keys(r_ns).map(function (key, index) {
            if (r_ns[key]) {
                r_c_ns[key] = r_ns[key]
            }
        });
        return r_c_ns;
    }

    this.prepSearchParams = function (s_p, layout) {
        var search_params = {};
        angular.copy(s_p, search_params);
        var keys = Object.keys(search_params);
        keys.map(function (key) {
            var key_type = layout.find(function (l) {
                if (l.uuid == key) {
                    return l
                }
            });
            key_type = key_type.valueType.toLowerCase();
            if (key_type == 'integer' || key_type == 'decimal') {

            } else {
                if (search_params[key] && search_params[key].length > 0) {
                    search_params[key] = "*" + search_params[key] + "*"
                }
            }
        });
        return search_params;
    }
}]);