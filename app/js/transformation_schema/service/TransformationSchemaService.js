pimsServices.service('TransformationSchemaService', ['$http', '$rootScope', function ($http, $rootScope) {
    function getPath(out) {
        if (out) {
            var paths = out.split(".");
            return paths[0];
        }
    }

    function getAttribute(out) {
        if (out) {
            var paths = out.split(".");
            return parseInt(paths[1]);
        }
    }

    this.addSchemaItem = function () {
        return {
            in: [],
            converters: [],
            default: [],
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


    this.addItemConst = function (item) {
        if (angular.isUndefined(item)) {
            item = {};
        }
        if (angular.isUndefined(item.default) || item.default == null) {
            item.default = [];
        }
        item.default.push("")
    };

    this.removeItemConst = function (item) {
        item.default = [];
    };


    this.addItemAttribute = function (item) {
        item.in.push({})
    };

    function is_reference(i, regexp) {
        if (i.hasOwnProperty('path')) {
            var match = i.path.match(regexp);
            if (match)
                return true;
        }
        return false;
    }

    function get_child_attr_from_path(i) {
        var segs = i.path.split('.');
        return segs[3];
    }

    function get_parent_attr_from_path(i) {
        if (i.hasOwnProperty('path') && i.path) {
            var segs = i.path.split('.');
            return segs[0];
        }
    }

    this.useDto = function (transformation_schema) {
        var t = transformation_schema;
        var schema = t.schema.schema;
        var regex = /.+value.+value/;
        if (schema) {
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
        } else {
            t.schema.schema = [];
        }
        return t;
    };

    function check_empty_default(def) {
        if (def) {
            return def.find(function (d) {
                if (d)
                    return d;
            });
        }
    }


    this.importExportTransformationSchema = function (transformation_schema) {
        var schema = transformation_schema.schema;
        var custom = transformation_schema.customAttributes;
        if (custom && custom.hasOwnProperty("export") && custom.export && schema.schema) {
            var schema = transformation_schema.schema.schema.map(function (s) {
                var out = {
                    path: getPath(s.out),
                    uuid: getAttribute(s.out)
                };

                var def = s.in.map(function (sd) {
                    return sd.default
                });
                if (!check_empty_default(def)) {
                    def = null;
                }

                return {
                    in: s.in,
                    converters: s.converters,
                    out: out,
                    default: def
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
                    out: s.out,
                    default: s.in.default
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

    function get_attribute_uuid(out, criteria) {
        var uuid = out.split(criteria);
        return uuid[1];
    }

    function get_attribute_value(attr_uuid, attributes) {
        var attribute = attributes.find(function (a) {
            if (a.uuid == attr_uuid)
                return a;
        });
        if (attribute) {
            return attribute.valueType;
        }
        return false;
    }

    function coerce_const_type(c, inn, out, attributes) {
        var out_attr_criteria = "attributes.",
            attr_uuid = null,
            attr_type = null;

        if (out.search(out_attr_criteria) >= 0) {
            attr_uuid = get_attribute_uuid(out, out_attr_criteria);
            attr_type = get_attribute_value(attr_uuid, attributes);
        } else if (angular.isNumber(inn.path)) {
            attr_uuid = inn.path;
            attr_type = get_attribute_value(attr_uuid, attributes);
        } else {
            attr_type = "string"
        }
        if (attr_type.toLowerCase() === 'integer') {
            return parseInt(c)
        } else if (attr_type.toLowerCase() === 'reference') {
            return parseInt(c)
        } else if (attr_type.toLowerCase() === 'decimal') {
            return parseFloat(c)
        } else if (attr_type.toLowerCase() === 'boolean') {
            if (typeof c == 'boolean') {
                return c
            }
            return c.toLowerCase() == "true" ? true : false
        } else {
            return c
        }
    }

    this.prepTransformationSchema = function (transformation_schema, dto, attributes) {
        return transformation_schema.map(function (schema) {
            var inn = schema.in.map(function (i) {
                if (i.hasOwnProperty('ref')) {
                    return {
                        ref: i.ref
                    }
                } else {
                    return {
                        uuid: parseInt(i.uuid),
                        path: selectPath(i, dto)
                    }
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


            if (schema.default) {
                schema.default.map(function (c, index) {
                    inn[index].default = coerce_const_type(c, inn[index], out, attributes)
                })
            }

            return {
                in: inn,
                converters: converters,
                out: out
            }
        })
    };

    function save_entity_types(preproc_schema) {
        if (preproc_schema) {
            var entity_type_eds = preproc_schema.filter(function (i) {
                if (i.out.entityTypeId)
                    return i;
            });
            return entity_type_eds.map(function (ps) {
                return ps.out.entityTypeId;
            });
        }
        return false;

    }

    this.prepPreProcSchema = function (preproc_schema) {
        var entity_type_ids = save_entity_types(preproc_schema);
        if (entity_type_ids.length > 0) {
            var schema = this.prepTransformationSchema(preproc_schema, false);
            entity_type_ids.map(function (id, index) {
                var p = schema[index].out;
                if (p && p.length > 0) {
                    schema[index].out = id + "." + p;
                } else {
                    schema[index].out = id.toString();
                }
            });
            return schema;
        }
        return [];
    };

    function get_entity_type_id(out) {
        if (out) {
            var path = out.split(".");
            return parseInt(path[0]);
        }
        return null;
    }

    function get_out_path(out) {
        if (out) {
            var path = out.split(".");
            return path[1];
        }
        return null;
    }

    this.preprocSchema = function (preproc_schema) {
        var schema = preproc_schema || [];
        schema = schema.map(function (s) {
            if (s.in) {
                var def = s.in.map(function (sd) {
                    return sd.default
                });
            }
            if (!check_empty_default(def)) {
                def = null;
            }
            return {
                in: s.in,
                default: def,
                out: {
                    entityTypeId: get_entity_type_id(s.out),
                    path: get_out_path(s.out)
                }
            }
        })
        return schema;
    };

    this.getReferencedEntity = function (id, attributes) {
        var attribute = attributes.find(function (a) {
            return a.uuid === id
        });
        if (attribute.valueType === "REFERENCE" || attribute.valueType === "ARRAY")
            return attribute.properties.referencedEntityTypeId;
        else
            return false
    }

    this.getReferencedAttributes = function (attributes) {
        var ref_attrs = attributes.filter(function (a) {
            return (a.valueType === "REFERENCE" || a.valueType === "ARRAY");
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