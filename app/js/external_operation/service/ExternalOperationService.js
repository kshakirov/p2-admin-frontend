pimsServices.service('ExternalOperationService', ['AttributeModel',
    function (AttributeModel) {
        this.update_external_system = function (external_operation) {
            external_operation.sourceSystem.id =
                external_operation.sourceSystem.frontendInfo.selected.id;
            external_operation.targetSystem.id =
                external_operation.targetSystem.frontendInfo.selected.id;
        };

        this.initAttributes = function (entity_type_uuid) {
            return AttributeModel.findAll(entity_type_uuid).then(function (attributes) {
                return attributes;
            });
        };

        this.createTripleArrayEntry = function (entity, attribute, converter) {
            return {
                entityName: entity.name,
                entityUUID: entity.uuid,
                attributeName: attribute.name,
                attributeUUID: attribute.uuid,
                converterName: converter.name,
                converterId: converter.id
            }
        };
        this.updateConverters = function (tripleArray) {
            var tripleHash = {};
            tripleArray.map(function (tirple) {
                if (tripleHash[triple.entityUUID]) {
                    tripleHash[triple.entityUUID] = {};
                }
                tripleHash[triple.entityUUID][tirple.attributeUUID] =
                    tirple[tripleHash.converterId];
            })
        }

    }]);