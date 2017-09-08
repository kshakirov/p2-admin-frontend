pimsServices.service('TransformationSchemaService', ['$http', '$rootScope', function ($http, $rootScope) {
    this.addSchemaItem = function () {
        return {
            in: [],
            converters: [],
            out: ""
        }
    };
    this.addItemConverter = function (item) {
        item.converters.push({
            id: "",
            params: {

            }
        })
    };

    this.addItemAttribute = function (item) {
        item.in.push({

        })
    };

    this.prepTransformationSchema = function (transformation_schema) {
        return transformation_schema.map(function (schema) {
            var inn = schema.in.map(function (i) {
                return {
                    uuid: i.uuid,
                    name: i.name,
                    path: i.name
                }
            });
            var converters = schema.converters.map(function (c) {
                return {
                    id: c.id,
                    params: c.params
                }
            });
            return {
                in: inn,
                converters: converters,
                out: schema.out
            }
        })
    }
}]);