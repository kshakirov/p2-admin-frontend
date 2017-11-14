pimsServices.service('UserModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/management/users/page/0").then(function (users) {
            return users.content
        })
    };

    this.findOne = function (et_uuid) {
        return $http.get("/rest/entity-types/" + et_uuid).then(function (entities) {
            return entities.data
        })
    };

    this.delete = function (uuid) {
        return $http.delete("/rest/entity-types/" + uuid).
        then(function (attribute) {
            return attribute.data
        })
    };

    this.create = function (entityType) {
        return $http.post("/rest/entity-types/",
            entityType).then(function (entityType) {
            return entityType.data
        })
    }

    this.update = function (entityType) {
        return $http.put("/rest/entity-types/"
            + entityType.uuid, entityType).then(function (entityType) {
            return entityType.data
        })
    }


}]);