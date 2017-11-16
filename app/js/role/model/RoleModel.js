pimsServices.service('RoleModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/management/roles/page/0").then(function (roles) {
            return roles.data.content
        })
    };

    this.findOne = function (id) {
        return $http.get("/management/roles/" + id + "/dto").then(function (entities) {
            return entities.data
        })
    };

    this.delete = function (id) {
        return $http.delete("/management/roles/" + id).
        then(function (attribute) {
            return attribute.data
        })
    };

    this.create = function (role) {
        return $http.post("/management/roles/",
            role).then(function (role) {
            return role.data
        })
    }

    this.update = function (role) {
        return $http.put("/management/roles/"
            + role.id, role).then(function (role) {
            return role.data
        })
    }


}]);