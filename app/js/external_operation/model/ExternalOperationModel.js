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
                return response.data.externalOperation;
            })
    };

    this.save = function (id, external_operation) {
        return $http.put("/sync-module/external-operations/" + id, external_operation)
            .then(function (response) {
                return response.data.externalOperation;
            })
    };

    this.create = function (external_operation) {
        return $http.post("/sync-module/external-operations/new", external_operation)
            .then(function (response) {
                return response.data.externalOperation;
            })
    };

    this.createPipeline = function () {
        return $http.get("/sync-module/external-operations/new")
            .then(function (response) {
                return response.data.externalOperation;
            })
    }

    this.checkImmediatePipelin = function (payload) {
        return $http.post("/control/notify/pipeline/immediate/check", payload)
            .then(function (response) {
                return response.data.externalOperations
            })
    };

}]);