pimsServices.service('CustomSyncOperationService', [
    function () {
        this.guessFileFormat = function (custom_operation) {
            var file_types = ['csv', 'excel'];
            var is_file = file_types.filter(function (ft) {
                if (custom_operation.name.toLowerCase().search(ft) >= 0)
                    return ft
            });
            return is_file.length > 0
        };

        this.guessImport = function (custom_operation) {
            var search_word = 'import';
            return custom_operation.name.toLowerCase().search(search_word) >= 0;
        };

        this.getDownloadFileName = function (custom_operation, pipes, external_systems) {
            if(!custom_operation.import){
                var entity_type_id = custom_operation.customAttributes.entityTypeId.uuid;
                console.log(external_systems);
                console.log(pipes);
                var pipe_id = custom_operation.customAttributes.pipe.id;
                var pipe = pipes.find(function (p) {
                    if(p.id==pipe_id)
                        return p
                });
                var ext_system = pipe.targetSystem;
                var entity_type = ext_system.customAttributes.entities[entity_type_id];
                var url = entity_type.write.url;
                url = url.split("/");
                if(url.length > 0)
                    return url[2];
                return "No File Is Configured";

            }
        }

    }]);