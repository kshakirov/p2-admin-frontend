pimsServices.service('TransformationSchemaModel', ['$http', '$rootScope',
    function ($http, $rootScope) {
        this.findAll = function () {
            return $http.get("/sync-module/mappings")
                .then(function (response) {
                    return response.data.mappings
                })
        };
        this.findOne = function (id) {
            return $http.get("/sync-module/mappings/" + id)
                .then(function (response) {
                    return response.data.mapping
                })
        };

        this.save = function (mapping) {
            return $http.post("/sync-module/mappings/new", mapping)
                .then(function (response) {
                    return response.data
                })
        };

        this.update = function (mapping) {
            return $http.put("/sync-module/mappings/" + mapping.id, mapping)
                .then(function (response) {
                    return response.data
                })
        }

        this.delete = function (id) {
            return $http.delete("/sync-module/mappings/" + id)
                .then(function (response) {
                    return response.data
                })
        }
    }])