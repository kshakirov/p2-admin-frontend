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
        if (angular.isUndefined(item)) {
            item = {};
        }
        if (angular.isUndefined(item.converters)) {
            item.converters = [];
        }
        item.converters.push({
            id: "",
            params: {}
        })
    };

    this.removeItemConverter = function (item) {
            item.converters = [];
    };

    this.addItemAttribute = function (item) {
        item.in.push({})
    };

    function is_reference(i, regexp) {
        var match = i.path.match(regexp);
        if (match)
            return true;
        return false;
    }

    function get_child_attr_from_path(i) {
        var segs = i.path.split('.');
        return segs[3];
    }

    function get_parent_attr_from_path(i) {
        var segs = i.path.split('.');
        return segs[0];
    }

    this.useDto = function (transformation_schema) {
        var t = transformation_schema;
        var schema = t.schema.schema;
        var regex = /.+value.+value/;
        schema = schema.map(function (s) {
            var reference = null;
            var inn = s.in.map(function (i) {
                if (is_reference(i, regex)) {
                    reference = {
                        referenceId: get_child_attr_from_path(i),
                        uuid: parseInt(get_child_attr_from_path(i)),
                        attributes: null
                    };
                }
                return {
                    uuid: parseInt(get_parent_attr_from_path(i)),
                    path: i.path
                }
            });
            return {
                in: inn,
                reference: reference,
                converters: s.converters,
                out: s.out
            }
        });
        t.schema.schema = schema;
        return t;
    };


    this.importExportTransformationSchema = function (transformation_schema) {
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


    function selectPath(i, dto) {
        if (angular.isUndefined(i.uuid)) {
            return i.path
        }
        if (dto) {
            return i.uuid + ".value";
        }
        return i.uuid;
    }

    function isRootAttribute(uuid) {
        return isNaN(uuid)
    }

    this.prepTransformationSchema = function (transformation_schema, dto) {
        return transformation_schema.map(function (schema) {
            var inn = schema.in.map(function (i) {
                return {
                    uuid: parseInt(i.uuid),
                    path: selectPath(i, dto)
                }
            });

            if (dto && schema.reference) {
                inn = inn.map(function (i) {
                    return {
                        uuid: i.uuid,
                        path: i.path + ".attributes." + schema.reference.uuid + ".value"
                    }
                });
            }

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
                if (isRootAttribute(out.uuid))
                    out = out.path;
                else
                    out = out.path + "." + out.uuid;
            }

            return {
                in: inn,
                converters: converters,
                out: out
            }
        })
    };
    this.getReferencedEntity = function (id, attributes) {
        var attribute = attributes.find(function (a) {
            return a.uuid === id
        });
        if (attribute.valueType === "REFERENCE")
            return attribute.properties.referencedEntityTypeId;
        else
            return false
    }

    this.getReferencedAttributes = function (attributes) {
        var ref_attrs = attributes.filter(function (a) {
            return a.valueType === "REFERENCE";
        });
        return ref_attrs.map(function (ra) {
            return ra.properties.referencedEntityTypeId;
        })
    }

    this.prepChildAttrSelectors = function (transformation_schema, attrs) {
        var transformation_schema = transformation_schema,
            schema = transformation_schema.schema.schema;
        schema = schema.forEach(function (s) {
            if (s.reference) {
                var attributes = attrs.find(function (as) {
                    var found = as.find(function (a) {
                        var id = parseInt(s.reference.referenceId)
                        return id === a.uuid;
                    })
                    if (found)
                        return true;
                    return false
                })
                s.reference.attributes = attributes;
            }
        });
        return transformation_schema;
    }
}]);