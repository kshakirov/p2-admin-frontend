pimsServices.service('ResourceModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/management/resources/page/0").then(function (resources) {
            return resources.data.content
        })
    };

    this.findOne = function (id) {
        return $http.get("/management/resources/" + id).then(function (resource) {
            return resource.data
        })
    };

    this.delete = function (id) {
        return $http.delete("/management/resources/" + id).
        then(function (attribute) {
            return attribute.data
        })
    };

    this.create = function (resource) {
        return $http.post("/management/resources/",
            resource).then(function (entityType) {
            return entityType.data
        })
    }

    this.update = function (resource) {
        return $http.put("/management/resources/"
            + resource.uuid, resource).then(function (entityType) {
            return entityType.data
        })
    }


}]);