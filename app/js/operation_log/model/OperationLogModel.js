pimsServices.service('OperationLogModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (body) {
        return $http.post("/control/operations", body).then(function (response) {
            return response.data;
        })
    }
}]);
