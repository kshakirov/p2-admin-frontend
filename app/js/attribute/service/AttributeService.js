pimsServices.service('AttributeService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.daoAttribute = function (attribute) {
        var attribute_to_save = {};
        angular.copy(attribute, attribute_to_save);
        if (attribute.properties.validators) {
            attribute_to_save.properties.validators = attribute.properties.validators.map(function (a) {
                return a.id;
            });
        }
        ;
        return attribute_to_save;
    }

    this.dtoAttribute = function (attribute, converters) {
        if (attribute.properties.validators && attribute.properties.validators.length > 0) {
            attribute.properties.validators = attribute.properties.validators.map(function (v) {
                var converter = converters.find(function (c) {
                    if(c.id==v){
                        return c
                    }
                })
                return converter;
            })
        }
        return attribute;
    }
}]);