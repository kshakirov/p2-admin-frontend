pimsServices.service('ExternalOperationModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/sync-module/external-operations")
            .then(function (response) {
            return response.data.externalOperations
        })
    };
    this.findOne = function (id) {
        return $http.get("/sync-module/external-operations/" + id)
            .then(function (response) {
                return response.data
            })
    }
}])