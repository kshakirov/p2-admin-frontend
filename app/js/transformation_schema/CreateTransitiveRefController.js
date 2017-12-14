function createTransitiveRefController(item, entity_types) {
    var item = item;
    var entity_types = entity_types;
    console.log(item);
    var CreateTransitiveRefController = function ($uibModalInstance, $scope, AttributeModel, $q) {


        $scope.entity_types = entity_types;
        $scope.transitive_search_attributes = [];
        $scope.transitive_reference_attributes = [];
        $scope.search_attribute_types = ['path', 'const'];

        function reloadAttributes(id) {
            return AttributeModel.findAll(id).then(function (attrs) {
                return attrs;
            }, function (error) {
                console.log(error);
            })
        }

        function find_reference_name(id) {
            var entity = entity_types.find(function (et) {
                if (et.uuid == id)
                    return et;
            });
            return entity.name;
        }

        function prep_keys(transitive_search_attributes) {
            var key = {};
            transitive_search_attributes.map(function (ta) {
                key[ta.attribute] = {};
                if (ta.type == 'path')
                    key[ta.attribute][ta.type] = ta.value;
                else
                    key[ta.attribute][ta.type] = {
                        value: ta.value,
                        type: "string"
                    };

            });
           return key;
        }

        function prep_projections(chained_references) {
            var projections = chained_references.map(function (cr) {
                return cr.attributes[0].attribute.uuid
            });
            return projections.join(".");
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
            return projections[0].split('.');
        }

        $scope.init = function () {
           var ref = item.in[0].ref;
           if(ref){
               $scope.searchEntityTypeId =ref.entityTypeId;
               var chained_attributes = get_chained_attributes(ref.projections);
               var promises = [];
               chained_attributes.slice(1).map(function (ca) {
                   promises.push(AttributeModel.findOne(1,ca))
               });
               return $q.all(promises).then(function (ref_attrs) {
                 return  reloadAttributes($scope.searchEntityTypeId).then(function (attrs) {
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
                           if(a.uuid==chained_attributes[0]){
                               return a
                           }
                       });
                       $scope.transitive_reference_attributes = [{
                           attribute: ref_attrs[0],
                       }];
                       $scope.reference_attributes = [ref_attrs[0]];
                       $scope.foundEntityAttribute = "REFERENCE TO " +
                           find_reference_name( $scope.referenceAttribute.properties.referencedEntityTypeId).toUpperCase();
                       $scope.chained_references = [];
                       ref_attrs.slice(0,-1).map(function (ra) {
                           $scope.chained_references.push({
                               referenceAttribute: ra,
                               referenceAttributes: [ra],
                               foundEntityAttribute: "REFERENCE TO " +
                               find_reference_name(ra.properties.referencedEntityTypeId).toUpperCase()
                           })
                       });

                        ref_attrs.slice(1).map(function (ra, index) {
                           $scope.chained_references[index].attributes = [{
                               attribute: ra,

                           }];
                            $scope.chained_references[index].reference_attributes =[ra]
                        })

                   })
               }) ;

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

        function create_reference_name(first, chained_references) {
            var name = first.name,
                last = chained_references[chained_references.length -1];
            return name + " > " + last.attributes[0].attribute.name;

        }

        $scope.removeChain = function () {
            $scope.chained_references = [];
            $scope.referenceAttribute = null;
            $scope.transitive_reference_attributes =[]
            $scope.reference_attributes = null;
            $scope.foundEntityAttribute = ""
            $scope.edit = false;
        };

        $scope.ok = function () {
            var projections = $scope.referenceAttribute.uuid + "." + $scope.transitive_reference_attributes[0].attribute.uuid;
            projections = projections + "." + prep_projections($scope.chained_references);
            console.log($scope.chained_references);
            var result = {
                entityTypeId: $scope.searchEntityTypeId,
                key: prep_keys($scope.transitive_search_attributes),
                projections: [projections],
                name: create_reference_name($scope.referenceAttribute, $scope.chained_references)
            };
            $uibModalInstance.close(result);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("Cancel");
        };
    };
    CreateTransitiveRefController.$inject = ['$uibModalInstance', '$scope', 'AttributeModel', '$q'];
    return CreateTransitiveRefController;
}

