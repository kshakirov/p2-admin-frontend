pimsServices.service('FilterModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/sync-module/search-filters")
            .then(function (response) {
                return response.data['search-filters']
            })
    };
    this.findOne = function (id) {
        return $http.get("/sync-module/search-filters/" + id)
            .then(function (response) {
                return response.data['search-filter']
            })
    };

    this.save = function (filter) {
        return $http.post("/sync-module/search-filters/new", filter)
            .then(function (response) {
                return response.data
            })
    };

    this.update = function (filter) {
        return $http.put("/sync-module/search-filters/" + filter.id, filter)
            .then(function (response) {
                return response.data
            })
    };

    this.delete = function (id) {
        return $http.delete("/sync-module/search-filters/" + id)
            .then(function (response) {
                return response.data
            })
    };
    
}]);