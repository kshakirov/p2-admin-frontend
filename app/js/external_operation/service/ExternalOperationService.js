pimsServices.service('ExternalOperationService', ['AttributeModel','ExternalOperationModel',
    '$timeout',
    function (AttributeModel,ExternalOperationModel,$timeout) {
        
        this.areSchemata_missed = function(external_operation) {
            var entities_with_schema = Object.keys(external_operation.transformationSchemata);
            entities_with_schema = entities_with_schema.map(function (key) {
                return external_operation.transformationSchemata[key];
            });

            var without_schemata = entities_with_schema.filter(function (es) {
                if(!es.hasOwnProperty('mapping')){
                    return true;
                }
            });
            if(without_schemata.length > 0){
                return without_schemata.map(function (ws) {
                    return ws.name
                })
            }
            return false;
        };
    
        this.update_transformation_schemata = function (external_operation) {

            var keys = Object.keys(external_operation.transformationSchemata),
                ts = {},
                eo = {};
            angular.copy(external_operation,eo);
            var old_ts = eo.transformationSchemata;

            keys.map(function (key) {
                ts[key] = {id: old_ts[key].mapping.id};
            });
            eo.transformationSchemata = ts;
            return eo;
        };

        this.dto_transformation_schemata = function (external_operation, transformation_schemata, entities) {
            var eo = external_operation,
                ts = transformation_schemata,
                nts = {},
                keys;
            keys = Object.keys(eo.transformationSchemata);
            keys.map(function (key) {
                nts[key] = entities.find(function (e) {
                    if(e.uuid==key){
                        return e
                    }
                });
                nts[key].mapping = transformation_schemata.find(function (s) {
                    if(s.id==eo.transformationSchemata[key].id){
                        return s;
                    }
                })

            });
            eo.transformationSchemata = nts;
        };

        this.dto_external_systems = function (external_operation) {
            external_operation.sourceSystem.id = external_operation.sourceSystem.frontendInfo.selected.id;
            external_operation.targetSystem.id = external_operation.targetSystem.frontendInfo.selected.id;
        };

        this.dto_entityTypes = function (external_operation) {
            external_operation.entityTypeIds  =  Object.keys(external_operation.transformationSchemata)

        };
        this.hasNotConfiguredImmediatePipeline = function (external_operation) {
            if(external_operation.customAttributes && external_operation.customAttributes.immediate) {
                var entityTypeIds  =  Object.keys(external_operation.transformationSchemata);
                var payload = {
                    entityTypeIds: entityTypeIds,
                    externalSystemIds: [
                        external_operation.sourceSystem.id,
                        external_operation.targetSystem.id
                    ]
                };

                return ExternalOperationModel.checkImmediatePipelin(payload)
            }else{
                return $timeout(function () {
                    return true
                }, 1000);
            }
        }

        this.prepErrorMessage = function (error) {
            var messages = error.data.error;
            messages = messages.map(function (m) {
                return "External System [" + m.name + "] => Entity Types [" + m.missedEntities + "]"
            });
            return messages.join(",")
        }

    }]);