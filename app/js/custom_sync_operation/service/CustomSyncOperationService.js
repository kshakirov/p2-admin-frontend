pimsServices.service('CustomSyncOperationService', ['$filter',
    function ($filter) {
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

        this.formatTime = function (custom_operation) {
            var timestamp = custom_operation.lastRun;
            if(timestamp) {
                timestamp = new Date(timestamp);
                return $filter("date")(timestamp, "yyyy-MM-dd HH:mm:ss");
            }
        };

        this.unformatTime = function (custom_operation) {
            var timestamp = custom_operation.lastRun || "01 Jan 1970 00:00:00 GMT";
            moment(timestamp).format('yyyy-MM-dd HH:mm:ss');
            return  moment(timestamp).valueOf();
        };

        this.guessCsvExport = function (custom_operation) {
            if (!custom_operation.customAttributes.import) {
                var filename = custom_operation.customAttributes.filename;
                if (filename && filename.length > 0)
                    return true
            }
            return false;
        };

        this.getFilename = function (custom_operation) {
            return custom_operation.customAttributes.filename;
        };

        this.getDownloadFileName = function (custom_operation, pipes, external_systems) {
            if (!custom_operation.import) {
                var entity_type_id = custom_operation.customAttributes.entityTypeId.uuid;
                console.log(external_systems);
                console.log(pipes);
                var pipe_id = custom_operation.customAttributes.pipe.id;
                var pipe = pipes.find(function (p) {
                    if (p.id == pipe_id)
                        return p
                });
                var ext_system = pipe.targetSystem;
                var entity_type = ext_system.customAttributes.entities[entity_type_id];
                var url = entity_type.write.url;
                if (url) {
                    url = url.split("/");
                    if (url.length > 0)
                        return url[2];
                }
                return "No File Is Configured";

            }
        }
        this.getQueues = function () {
            return [
                {id: "decisionBatch", name: "Export Batch Queue"},
                {id: "fileQueue", name:  "Import From File Queue"},
                {id: "openerpBatch", name:  "Import From OpenErp"},
                {id: "amazonBatch", name:  "Import From Amazon"}

            ]
        }

    }]);

pimsServices.service('CustomSyncNotificationService', [
    function () {
        var operations = {};
        var message = {
            CustomOperation: {
                name: null,
                id: null,
                pipelineId: null,
                entityTypeId: null,
                batchSize: null,
                args: {
                    "incremental": true,
                    "lastModifiedAfter": "1970-01-01 15:45:20"
                }
            },
            EntityInfo: {
                id: null,
                entityTypeId: null
            },
            PipelineInfo: {
                transformationSchemata: []
            }
        };

        this.processMessage = function (msg) {
            console.log(operations);
            if (operations.hasOwnProperty(msg.operationId)) {
                operations[msg.operationId] = msg;
                console.log("Yes")

            } else {
                operations[msg.operationId] = msg;
                console.log("NO")
            }
        };
        this.getNotifications = function () {
            return operations;
        };
        this.prepMessage = function (custom_sync_operation) {
            var m = {};
            angular.copy(message, m);
            m.CustomOperation.name = custom_sync_operation.name;
            m.CustomOperation.pipelineId = custom_sync_operation.customAttributes.pipe.id;
            m.CustomOperation.id = custom_sync_operation.id;
            m.CustomOperation.filters = custom_sync_operation.customAttributes.filters;
            m.CustomOperation.batchSize = custom_sync_operation.customAttributes.batchSize || 1500;
            m.CustomOperation.entityTypeId = custom_sync_operation.customAttributes.entityTypeId.uuid;
            m.EntityInfo.entityTypeId = custom_sync_operation.customAttributes.entityTypeId.uuid;
            m.PipelineInfo.transformationSchemata = custom_sync_operation.customAttributes.transformationSchema;
            return m;
        };

        this.makeFull = function (m) {
            m.CustomOperation.args.incremental = false;
            return m;
        };

        this.addDate = function (m, date) {
            m.CustomOperation.args.lastModifiedAfter = message.lastRun || date;
            return m;
        }

        this.addFile = function (m, downloadFilename) {
            if(downloadFilename){
                m.CustomOperation.args.filename = downloadFilename
            }
            return m;
        }
    }]);