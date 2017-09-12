pimsServices.service('ExternalOperationService', ['AttributeModel',
    function (AttributeModel) {
        this.update_transformation_schemata = function (external_operation) {

            var keys = Object.keys(external_operation.transformationSchemata),
                ts = {},
                eo = {};
            angular.copy(external_operation,eo);
            var old_ts = eo.transformationSchemata;

            keys.map(function (key) {
                ts[key] = old_ts[key].mapping.id;
            })
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
                    if(s.id==eo.transformationSchemata[key]){
                        return s;
                    }
                })

            });
            eo.transformationSchemata = nts;
        }

    }]);