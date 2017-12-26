pimsServices.service('AttachmentService', ['$http', '$rootScope',
    'Upload','EntityModel',
    function ($http, $rootScope, Upload,EntityModel) {
        var upload_url = "/rest/binary/file/";
        this.upload = function (file, id) {
            return Upload.upload({
                url: upload_url + id,
                data: {file: file}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });

        };
        this.preview = function (info) {
            var formats = /jpeg|png|gif/;
            if (info.contentType.search(formats) >= 0) {
                return true
            }
            return false
        };


    }]);