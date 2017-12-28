pimsServices.service('CustomSyncOperationModel', ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {

        this.findAll = function () {
            return $http.get("/sync-module/custom-sync-operations")
                .then(function (response) {
                    return response.data.customOperations
                })
        };
        this.findOne = function (id) {
            return $http.get("/sync-module/custom-sync-operations/" + id)
                .then(function (response) {
                    return response.data
                })
        };


        this.delete = function (id) {
            return $http.delete("/sync-module/custom-sync-operations/" + id)
                .then(function (response) {
                    return response.data
                })
        };

        this.create = function (custom_sync_operaton) {
            return $http.post("/sync-module/custom-sync-operations/new", custom_sync_operaton)
                .then(function (response) {
                    return response.data
                })
        };

        this.update = function (custom_sync_operaton) {
            return $http.put("/sync-module/custom-sync-operations/" + custom_sync_operaton.id, custom_sync_operaton)
                .then(function (response) {
                    return response.data
                })
        };

        this.deleteFile = function (filename) {
            return $http.delete("/control/csv/file/" + filename)
                .then(function (response) {
                    return response.data
                })
        }




}]);