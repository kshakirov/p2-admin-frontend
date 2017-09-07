pimsServices.service('ConverterModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/sync-module/converters")
            .then(function (response) {
                return response.data.converters
            })
    };
    this.findOne = function (id) {
        return $http.get("/sync-module/converters/" + id)
            .then(function (response) {
                return response.data.converter
            })
    };

    this.save = function (converter) {
        return $http.post("/sync-module/converters", converter)
            .then(function (response) {
                return response.data
            })
    };

    this.update = function (converter) {
        return $http.put("/sync-module/converters/" + converter.id, converter)
            .then(function (response) {
                return response.data
            })
    }

    this.delete = function (id) {
        return $http.delete("/sync-module/converters/" + id)
            .then(function (response) {
                return response.data
            })
    }
}]);