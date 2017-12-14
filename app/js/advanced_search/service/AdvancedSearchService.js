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
        var fields =  keys.map(function (key) {
            return attributes[key].uuid
        });
        return fields;
    };
    this.prepReferencesName = function (referencesName) {
        var r_ns = {},
            r_c_ns = {},
            keys = Object.keys(referencesName);
        keys.map(function (key) {
            if(referencesName[key].length > 0 && referencesName[key][0].attributes.length > 0) {
                r_ns[key] = referencesName[key][0].attributes[0].uuid.toString();
            }else {
                return false;
            }
        });
        Object.keys(r_ns).map(function(key, index) {
            if(r_ns[key]){
               r_c_ns[key] = r_ns[key]
            }
        });
        return r_c_ns;
    }
}]);