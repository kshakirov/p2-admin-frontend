pimsServices.service('EntityModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (et_uuid, page, size) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/entities/page/" + page + "?size=" + size).then(function (entities) {
            return entities.data
        })
    };

    this.findOne = function (et_uuid, uuid) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/entities/" + uuid +"/dto").then(function (entities) {
            return entities.data
        })
    };

    this.delete = function (et_uuid, uuid) {
        return $http.delete("/rest/entity-types/" + et_uuid
            + "/entities/" + uuid).then(function (entities) {
            return entities.data
        })
    };

    this.save = function (et_uuid, entity) {
        return $http.put("/rest/entity-types/" + et_uuid
            + "/entities", entity).then(function (entities) {
            return entities.data
        })
    }


}]);