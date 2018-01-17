pimsApp.controller('CustomSyncOperationController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'CustomSyncOperationModel', 'NotificationModel',
    '$q', 'ExternalOperationModel', 'TransformationSchemaModel', 'EntityTypeModel',
    'ExternalSystemModel', 'Upload', 'FileSaver', 'CustomSyncOperationService',
    'ngNotify', 'CustomSyncNotificationService', 'uibDateParser','$filter',
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
              ExternalSystemModel,
              Upload,
              FileSaver,
              CustomSyncOperationService,
              ngNotify,
              CustomSyncNotificationService,
              uibDateParser, $filter ) {

        var loads = [
            ExternalOperationModel.findAll(),
            TransformationSchemaModel.findAll(),
            EntityTypeModel.findAll(),
            ExternalSystemModel.findAll()
        ];
        $scope.date =  $filter('date')(Date.now(),'yyyy-MM-dd HH:mm:ss');

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
                        if (angular.isUndefined(custom_sync_operation.import)) {
                            $scope.custom_sync_operation.customAttributes.import = CustomSyncOperationService
                                .guessImport(custom_sync_operation);
                        }
                        if (angular.isUndefined(custom_sync_operation.hasAttachments)) {
                            $scope.custom_sync_operation.customAttributes.hasAttachments = CustomSyncOperationService
                                .guessFileFormat(custom_sync_operation);
                            $scope.downloadFilename = CustomSyncOperationService
                                .getDownloadFileName($scope.custom_sync_operation, promises[0], promises[3])
                        }
                        if (angular.isUndefined(custom_sync_operation.customAttributes.batchSize)) {
                            $scope.custom_sync_operation.customAttributes.batchSize = 1500;
                        }

                    })
                }
            })

        };

        $scope.saveCustomSyncOperation = function (custom_sync_operaton) {
            if (custom_sync_operaton.id) {
                CustomSyncOperationModel.update(custom_sync_operaton).then(function (promise) {
                    ngNotify.set('Your Custom Operation Saved!', 'success');
                })
            } else {
                CustomSyncOperationModel.create(custom_sync_operaton).then(function (promise) {
                    ngNotify.set('Your Custom Operation Created', 'success');
                })
            }
        };

        $scope.deleteCustomSyncOperation = function (id) {
            CustomSyncOperationModel.delete(id).then(function (promise) {
                ngNotify.set('Your Custom Operation Deleted!', 'success');
            })
        };

        $scope.cancel = function () {
            $location.path("/custom-sync-operations");
        };

        function runCustomSyncOperation(message, queue_prefix, downloadFilename) {
            if (downloadFilename) {
                CustomSyncOperationModel.deleteFile(downloadFilename).then(function () {
                    console.log("File Deleted")
                }, function (error) {
                    console.log("Problems Deleting file")
                })
            }
            console.log(message);
            NotificationModel.notifyBatch(message, queue_prefix).then(function (response) {
                ngNotify.set('Your Operation Has Just Scheduled for Run');
            })

        }

        $scope.runFull = function (custom_sync_operation) {
            var message = CustomSyncNotificationService.prepMessage(custom_sync_operation),
                queue_prefix = custom_sync_operation.customAttributes.queuePrefix;
            message = CustomSyncNotificationService.makeFull(message);
            message = CustomSyncNotificationService.addFile(message, $scope.custom_sync_operation.customAttributes.filename);
            runCustomSyncOperation(message, queue_prefix, $scope.downloadFilename)
        };
        $scope.runIncremental = function (custom_sync_operation, date) {
            var message = CustomSyncNotificationService.prepMessage(custom_sync_operation),
                queue_prefix = custom_sync_operation.customAttributes.queuePrefix;
            console.log(date);
            message = CustomSyncNotificationService.addDate(message,date);
            runCustomSyncOperation(message, queue_prefix, $scope.downloadFilename)
        };

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
                if (data.status == 404) {
                    ngNotify.set("The File '" + filename + "' Does Not Exist", 'error');
                } else {
                    console.log('Unable to download the file')
                }

            });
        }


    }]);