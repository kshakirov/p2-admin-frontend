pimsServices.service('EntityModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (et_uuid, page) {
        return $http.get("/pims/rest/entity-types/" + et_uuid
            + "/entities/page/" + page + "?size=5").then(function (entities) {
            return entities.data.content
        })
    };

    this.findOne = function (et_uuid, uuid) {
        return $http.get("/pims/rest/entity-types/" + et_uuid
            + "/entities/" + uuid +"/dto").then(function (entities) {
            return entities.data
        })
    };

    this.delete = function (et_uuid, uuid) {
        return $http.delete("/pims/rest/entity-types/" + et_uuid
            + "/entities/" + uuid).then(function (entities) {
            return entities.data
        })
    };

    this.save = function (et_uuid, attribute) {
        return $http.post("/pims/rest/entity-types/" + et_uuid
            + "/entities", attribute).then(function (entities) {
            return entities.data
        })
    }


}]);