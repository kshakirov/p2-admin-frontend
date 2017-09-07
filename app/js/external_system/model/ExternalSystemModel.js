pimsServices.service('ExternalSystemModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/sync-module/external-systems")
            .then(function (response) {
                return response.data.externalSystems
            })
    };
    this.findOne = function (id) {
        return $http.get("/sync-module/external-systems/" + id)
            .then(function (response) {
                return response.data
            })
    };

    this.save = function (external_system) {
        return $http.post("/sync-module/external-systems", external_system)
            .then(function (response) {
                return response.data
            })
    };

    this.update = function (external_system) {
        return $http.put("/sync-module/external-systems/" + external_system.id, external_system)
            .then(function (response) {
                return response.data
            })
    }
}]);