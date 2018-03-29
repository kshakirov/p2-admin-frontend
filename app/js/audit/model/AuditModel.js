pimsServices.service('AuditModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (body) {
        return $http.post("/control/audits", body).then(function (response) {
            return response.data;
        })
    };

    this.findAggregations = function (data) {
        return $http.post("/control/search/aggregations", data).then(function (response) {
            return response.data;
        })
    }
}]);
