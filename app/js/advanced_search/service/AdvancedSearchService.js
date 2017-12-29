pimsServices.service('AdvancedSearchService', ['$http', function ($http) {
    var empty_space_regexp = /\s+/;
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
    };

    function is_phrase(query_string) {
        var match = query_string.match(empty_space_regexp);
        return match !== null;
    }

    function prep_phrase(query_string) {
        return "\"" + query_string + "\"";
    }

    function prep_wildcard(query_string) {
        return "*" + query_string + "*"
    }

    function is_not_empty(query_string) {
        if (query_string)
            return query_string.length > 0;
        return false;
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
                var query_string = search_params[key];
                if (is_not_empty(query_string)) {
                    if (is_phrase(query_string))
                        search_params[key] = prep_phrase(query_string);
                    else
                        search_params[key] = prep_wildcard(query_string)
                }
            }
        });
        return search_params;
    }
}]);