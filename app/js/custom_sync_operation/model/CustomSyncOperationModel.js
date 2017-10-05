pimsServices.service('CustomSyncOperationModel', ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {

    var operations = [
        {
            name: "Sync All Products 2 Elastic",
            code: "All",
            pipe: "Pims 2 Elastic Pipe",
            schema: "Default",
            entityTypeId: "Product",
            filter: "price > 100",
            id: 1
        }
    ];

        this.findAll = function () {
            return $http.get("/sync-module/custom-sync-operations")
                .then(function (response) {
                    return response.data.externalSystems
                })
        };
        this.findOne = function (id) {
            return $http.get("/sync-module/custom-sync-operations/" + id)
                .then(function (response) {
                    return response.data
                })
        };

        this.save = function (external_system) {
            return $http.post("/sync-module/custom-sync-operations/new", external_system)
                .then(function (response) {
                    return response.data
                })
        };

        this.update = function (external_system) {
            return $http.put("/sync-module/custom-sync-operations/" + external_system.id, external_system)
                .then(function (response) {
                    return response.data
                })
        }


}]);