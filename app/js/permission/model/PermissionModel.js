pimsServices.service('PermissionModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/management/permissions/page/0").then(function (users) {
            return users.data.content
        })
    };

    this.findOne = function (id) {
        return $http.get("/management/permissions/" + id).then(function (permission) {
            return permission.data
        })
    };

    this.delete = function (id) {
        return $http.delete("/management/permissions/" + id).
        then(function (permission) {
            return permission.data
        })
    };

    this.create = function (permission) {
        return $http.post("/management/permissions/",
            permission).then(function (permission) {
            return permission.data
        })
    }

    this.update = function (permission) {
        return $http.put("/management/permissions/"
            + permission.id, permission).then(function (permission) {
            return permission.data
        })
    }


}]);