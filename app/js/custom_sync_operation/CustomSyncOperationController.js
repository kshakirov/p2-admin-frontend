pimsApp.controller('CustomSyncOperationController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'CustomSyncOperationModel', 'NotificationModel',
    '$q', 'ExternalOperationModel', 'TransformationSchemaModel', 'EntityTypeModel',
    'MessageService', 'ExternalSystemModel', 'Upload','FileSaver', 'CustomSyncOperationService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              CustomSyncOperationModel,
              NotificationModel,
              $q,
              ExternalOperationModel,
              TransformationSchemaModel,
              EntityTypeModel,
              MessageService,
              ExternalSystemModel,
              Upload,
              FileSaver,
              CustomSyncOperationService) {

        var loads = [
            ExternalOperationModel.findAll(),
            TransformationSchemaModel.findAll(),
            EntityTypeModel.findAll(),
            ExternalSystemModel.findAll()
        ];
        $rootScope.message = MessageService.prepareMessage();

        var message = {
            CustomOperation: {
                name: null,
                pipelineId: null,
                entityTypeId: null,
                args:{

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

        $scope.init = function () {
            var id = $routeParams.id;
            $q.all(loads).then(function (promises) {
                $scope.transformationSchemata = promises[1];
                $scope.pipes = promises[0];
                $scope.entityTypes = promises[2];
                $scope.external_sytems = promises[3];
                if (id === "new") {
                    $scope.custom_sync_operation = {}
                } else {
                    CustomSyncOperationModel.findOne(id).then(function (custom_sync_operation) {
                        $scope.custom_sync_operation = custom_sync_operation;
                        if(angular.isUndefined(custom_sync_operation.import)){
                            $scope.custom_sync_operation.customAttributes.import = CustomSyncOperationService
                                .guessImport(custom_sync_operation);
                        }
                        if(angular.isUndefined(custom_sync_operation.hasAttachments)){
                            $scope.custom_sync_operation.customAttributes.hasAttachments = CustomSyncOperationService
                                .guessFileFormat(custom_sync_operation);
                            $scope.downloadFilename = CustomSyncOperationService
                                .getDownloadFileName($scope.custom_sync_operation, promises[0], promises[3])
                        }

                    })
                }
            })

        };

        $scope.saveCustomSyncOperation = function (custom_sync_operaton) {
            if (custom_sync_operaton.id) {
                CustomSyncOperationModel.update(custom_sync_operaton).then(function (promise) {
                    MessageService.setSuccessMessage($rootScope.message, "Your Custom Operation Saved!")
                })
            } else {
                CustomSyncOperationModel.create(custom_sync_operaton).then(function (promise) {
                    MessageService.setSuccessMessage($rootScope.message, "Your Custom Operation Started!")
                })
            }
        };

        $scope.deleteCustomSyncOperation = function (id) {
            CustomSyncOperationModel.delete(id).then(function (promise) {
                MessageService.setDangerMessage($rootScope.message, "Your Custom Operation Deleted!")
            })
        };

        $scope.cancel = function () {
            $location.path("/custom-sync-operations");
        };

        $scope.runCustomSyncOperation = function (custom_sync_operation) {
            var queue_prefix = custom_sync_operation.customAttributes.queuePrefix;
            message.CustomOperation.name = custom_sync_operation.name;
            message.CustomOperation.pipelineId = custom_sync_operation.customAttributes.pipe.id;
            message.CustomOperation.entityTypeId = custom_sync_operation.customAttributes.entityTypeId.uuid;
            message.EntityInfo.entityTypeId = custom_sync_operation.customAttributes.entityTypeId.uuid;
            message.PipelineInfo.transformationSchemata = custom_sync_operation.customAttributes.transformationSchema;
            NotificationModel.notifyBatch(message, queue_prefix).then(function (response) {
                //$rootScope.message.success = true;
                //MessageService.setInfoMessage($rootScope.message, "Your Operation Has Just Scheduled for Run")
            })

        }

        $scope.upload = function (file) {

            var url = '/control/file-upload';
            Upload.upload({
                url: url,
                data: {file: file}
            }).then(function (resp) {
                console.log('Success ' + 'uploaded. Response: ' + resp.data.fileName);
                console.log(resp);
                $scope.custom_sync_operation.customAttributes.filename = resp.data.fileName;
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data);
            });

        };


        $scope.download = function (filename) {
            $http({
                url: '/control/file-download',
                method: "POST",
                data: {
                    filename: filename
                },
                responseType: 'blob'
            }).then(function (data) {
                var blob = new Blob([data.data], {type: 'text/plain'});
                var fileName = filename;
                FileSaver.saveAs(blob, fileName)
            }, function (data) {
                if(data.status==404){
                    MessageService.setDangerMessage($rootScope.message, "The File '" + filename + "' Does Not Exist");
                }else{
                    console.log('Unable to download the file')
                }

            });
        }


    }]);