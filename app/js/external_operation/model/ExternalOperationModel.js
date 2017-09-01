pimsServices.service('ExternalOperationModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/sync-module/external-operations")
            .then(function (attributes) {
            return attributes.data
        })
    };
}])