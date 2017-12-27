function createTransitiveRefController(item, entity_types) {
    var item = item;
    var entity_types = entity_types;
    console.log(item);
    var CreateTransitiveRefController = function ($uibModalInstance, $scope, AttributeModel, $q) {


        $scope.entity_types = entity_types;
        $scope.transitive_search_attributes = [];
        $scope.transitive_reference_attributes = [];
        $scope.search_attribute_types = ['path', 'default'];

        function reloadAttributes(id) {
            return AttributeModel.findAll(id).then(function (attrs) {
                return attrs;
            }, function (error) {
                console.log(error);
            })
        }

        function find_reference_name(attribute) {
            if (attribute && attribute.hasOwnProperty('properties')
                && attribute.properties.hasOwnProperty('referencedEntityTypeId')) {
                var id = attribute.properties.referencedEntityTypeId;
                var entity = entity_types.find(function (et) {
                    if (et.uuid == id)
                        return et;
                });
                return entity.name;
            }
            return ""
        }


        function coerce_const_type(c, uuid, search_attributes) {
            var attr_type = search_attributes.find(function (sa) {
                if (sa.uuid == uuid)
                    return sa
            });
            attr_type = attr_type.valueType;
            if (attr_type.toLowerCase() === 'integer' || attr_type.toLowerCase() === 'reference') {
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


        function prep_keys(transitive_search_attributes, search_attributes) {
            var key = {};
            transitive_search_attributes.map(function (ta) {
                key[ta.attribute] = {};
                if (ta.type == 'path')
                    key[ta.attribute][ta.type] = ta.value;
                else if (ta.type == 'default') {
                    key[ta.attribute][ta.type] = coerce_const_type(ta.value, ta.attribute, search_attributes);
                }
            });
            return key;
        }

        function prep_projections(chained_references) {
            if (angular.isUndefined(chained_references)) {
                return ""
            } else {
                var projections = chained_references.filter(function (cr) {
                    if (cr.hasOwnProperty('attributes'))
                        return cr
                });
                projections = projections.map(function (cr) {
                    return cr.attributes[0].attribute.uuid
                });
                return projections.join(".");
            }
        }

        $scope.reloadSearchAttributes = function (id) {
            return reloadAttributes(id).then(function (attrs) {
                $scope.search_attributes = attrs
            })
        };

        $scope.reloadReferenceAttributes = function (attribute) {
            if (attribute.properties.hasOwnProperty('referencedEntityTypeId')) {
                var id = attribute.properties.referencedEntityTypeId;
                return reloadAttributes(id).then(function (attrs) {
                    $scope.reference_attributes = attrs;
                    $scope.foundEntityAttribute = "REFERENCE TO " + find_reference_name(id).toUpperCase();
                })
            } else {
                $scope.foundEntityAttribute = "Return Attribute "
            }

        };

        function get_chained_attributes(projections) {
            var attrs = projections[0].split('.');
            return attrs.filter(function (a) {
                if (a.length > 0)
                    return a
            })
        }

        $scope.init = function () {
            var ref = item.in[0].ref;
            if (ref) {
                $scope.searchEntityTypeId = ref.entityTypeId;
                var chained_attributes = get_chained_attributes(ref.projections);
                var promises = [];
                chained_attributes.slice(1).map(function (ca) {
                    promises.push(AttributeModel.findOne(1, ca))
                });
                return $q.all(promises).then(function (ref_attrs) {
                    return reloadAttributes($scope.searchEntityTypeId).then(function (attrs) {
                        $scope.search_attributes = attrs;
                        $scope.edit = true;
                        $scope.transitive_search_attributes = Object.keys(ref.key).map(function (k) {
                            var type = Object.keys(ref.key[k])[0];
                            return {
                                attribute: parseInt(k),
                                type: type,
                                value: ref.key[k][type]
                            }
                        });

                        $scope.referenceAttribute = $scope.search_attributes.find(function (a) {
                            if (a.uuid == chained_attributes[0]) {
                                return a
                            }
                        });

                        if (ref_attrs.length > 0) {
                            $scope.transitive_reference_attributes = [{
                                attribute: ref_attrs[0],
                            }];
                            $scope.reference_attributes = [ref_attrs[0]];
                        }
                        $scope.foundEntityAttribute = "REFERENCE TO " +
                            find_reference_name($scope.referenceAttribute).toUpperCase();
                        $scope.chained_references = [];
                        ref_attrs.slice(0, -1).map(function (ra) {
                            $scope.chained_references.push({
                                referenceAttribute: ra,
                                referenceAttributes: [ra],
                                foundEntityAttribute: "REFERENCE TO " +
                                find_reference_name(ra).toUpperCase()
                            })
                        });

                        ref_attrs.slice(1).map(function (ra, index) {
                            $scope.chained_references[index].attributes = [{
                                attribute: ra,

                            }];
                            $scope.chained_references[index].reference_attributes = [ra]
                        })

                    })
                });

            }
        };

        $scope.addSearchAttribute = function () {
            $scope.transitive_search_attributes.push({})
        };

        $scope.addReferenceAttribute = function () {
            $scope.transitive_reference_attributes.push({})
        };

        $scope.addChainedReferenceAttribute = function (reference) {
            reference.attributes = [{}]
        };

        $scope.addChainedReference = function (attribute, index) {
            if (attribute.properties && attribute.properties.hasOwnProperty('referencedEntityTypeId')) {
                var id = attribute.properties.referencedEntityTypeId;
                return reloadAttributes(id).then(function (attrs) {
                    if (angular.isUndefined(index)) {
                        $scope.chained_references = [];

                    }
                    var chain = {
                        referenceAttributes: [attribute],
                        referenceAttribute: attribute,

                    };
                    $scope.chained_references.push(chain);
                    chain.reference_attributes = attrs;
                    chain.foundEntityAttribute = "REFERENCE TO " + find_reference_name(id).toUpperCase();
                })
            }
        };

        function create_reference_name(searchEntityTypeId, referenceAttribute, chained_references) {
            var name = entity_types.find(function (et) {
                if (et.uuid == searchEntityTypeId)
                    return et
            });
            name = name.name;
            var second_name = referenceAttribute.name;
            if (angular.isUndefined(chained_references) ||
                chained_references.length == 0 ||
                !chained_references[chained_references.length - 1].hasOwnProperty('attributes'))
                return name + "> " + second_name;
            return name + " > " + chained_references[chained_references.length - 1].attributes[0].attribute.name;

        }

        function create_simple_name(searchEntityTypeId) {
            var name = entity_types.find(function (et) {
                if (et.uuid == searchEntityTypeId)
                    return et
            });
            name = name.name;

            return name + " > " + "pimsId";

        }

        $scope.removeSearchAttribute = function (index) {
            $scope.transitive_search_attributes.splice(index, 1);
        };

        $scope.removeChain = function () {
            $scope.chained_references = [];
            $scope.referenceAttribute = null;
            $scope.transitive_reference_attributes = []
            $scope.reference_attributes = null;
            $scope.foundEntityAttribute = "";
            $scope.edit = false;
        };

        $scope.ok = function () {
            var result = {};
            if ($scope.referenceAttribute && $scope.referenceAttribute.uuid) {
                var projections = $scope.referenceAttribute.uuid;
                if ($scope.transitive_reference_attributes.length > 0
                    && $scope.transitive_reference_attributes[0].hasOwnProperty('attribute')) {
                    projections = projections + "." + $scope.transitive_reference_attributes[0].attribute.uuid;
                }
                projections = projections + "." + prep_projections($scope.chained_references);
                result = {
                    entityTypeId: $scope.searchEntityTypeId,
                    key: prep_keys($scope.transitive_search_attributes, $scope.search_attributes),
                    projections: [projections],
                    name: create_reference_name($scope.searchEntityTypeId, $scope.referenceAttribute, $scope.chained_references)
                };
            } else {
                result = {
                    entityTypeId: $scope.searchEntityTypeId,
                    key: prep_keys($scope.transitive_search_attributes, $scope.search_attributes),
                    projections: ['uuid'],
                    name: create_simple_name($scope.searchEntityTypeId)
                };
            }

            $uibModalInstance.close(result);

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("Cancel");
        };
    };
    CreateTransitiveRefController.$inject = ['$uibModalInstance', '$scope', 'AttributeModel', '$q'];
    return CreateTransitiveRefController;
}

