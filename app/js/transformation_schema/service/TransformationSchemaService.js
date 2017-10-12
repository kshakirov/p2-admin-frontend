pimsServices.service('TransformationSchemaService', ['$http', '$rootScope', function ($http, $rootScope) {
    function getPath(out) {
        var paths = out.split(".");
        return paths[0];
    }

    function getAttribute(out) {
        var paths = out.split(".");
        return parseInt(paths[1]);
    }

    this.addSchemaItem = function () {
        return {
            in: [],
            converters: [],
            out: ""
        }
    };

    this.addSchemaItemExport = function () {
        return {
            in: [{"path": null}],
            converters: [],
            out: [{path: "", uuid: null}]
        }
    };
    this.addItemConverter = function (item) {
        item.converters.push({
            id: "",
            params: {}
        })
    };

    this.addItemAttribute = function (item) {
        item.in.push({})
    };

    this.dtoExportTransformationSchema = function (transformation_schema) {
        var schema = transformation_schema.schema;
        var custom = transformation_schema.customAttributes;
        if (custom && custom.hasOwnProperty("export") && custom.export && schema.schema) {
            var schema = transformation_schema.schema.schema.map(function (s) {
                var out = {
                    path: getPath(s.out),
                    uuid: getAttribute(s.out)
                };


                return {
                    in: s.in,
                    converters: s.converters,
                    out: out
                }
            });
            transformation_schema.schema.schema = schema;
        } else if (schema.hasOwnProperty("schema")) {
            var schema = transformation_schema.schema.schema.map(function (s) {
                var inn = s.in.map(function (i) {
                    return {
                        uuid: parseInt(i.uuid),
                        path: selectPath(i)
                    }
                });
                return {
                    in: inn,
                    converters: s.converters,
                    out: s.out
                }
            });
            transformation_schema.schema.schema = schema;
        } else {
            transformation_schema.schema.schema = [];
        }
        return transformation_schema
    };


    function selectPath(i) {
        if (angular.isUndefined(i.uuid)) {
            return i.path
        }
        return i.uuid;
    }

    function isRootAttribute(uuid) {
        return isNaN(uuid)
    }

    this.prepTransformationSchema = function (transformation_schema) {
        return transformation_schema.map(function (schema) {
            var inn = schema.in.map(function (i) {
                return {
                    uuid: parseInt(i.uuid),
                    path: selectPath(i)
                }
            });

            var converters = schema.converters;
            if (converters) {
                converters = schema.converters.map(function (c) {
                    return {
                        id: c.id,
                        params: c.params
                    }
                });
            }

            var out = schema.out;
            if (angular.isObject(out)) {
                if(isRootAttribute(out.uuid))
                    out=out.path
                else
                    out = out.path + "." + out.uuid;
            }

            return {
                in: inn,
                converters: converters,
                out: out
            }
        })
    }
}]);