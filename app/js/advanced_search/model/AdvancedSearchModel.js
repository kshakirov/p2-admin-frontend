pimsServices.service('AdvancedSearchModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (query) {
        return $http.post("/search", query).then(function (response) {
            return response.data;
        })
    }
}])