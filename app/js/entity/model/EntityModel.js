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

    this.createTemplate = function (et_uuid) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/entities/template").then(function (template) {
            return template.data
        })
    };

    this.delete = function (et_uuid, uuid) {
        return $http.delete("/rest/entity-types/" + et_uuid
            + "/entities/" + uuid).then(function (entities) {
            return entities.data
        })
    };

    this.update = function (et_uuid, entity) {
        return $http.put("/rest/entity-types/" + et_uuid
            + "/entities/" + entity.uuid, entity).then(function (entities) {
            return entities.data
        })
    };
    this.create = function (et_uuid, entity) {
        return $http.post("/rest/entity-types/" + et_uuid
            + "/entities", entity).then(function (entities) {
            return entities.data
        })
    }
    this.search = function (et_uuid, params, page, size) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/entities/findByAttribute/page/" + page + "?" + params).then(function (entities) {
            return entities.data
        })
    }


}]);