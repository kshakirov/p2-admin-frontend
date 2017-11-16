pimsServices.service('GroupModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/management/groups/page/0").then(function (groups) {
            return groups.data.content
        })
    };

    this.findOne = function (id) {
        return $http.get("/management/groups/" + id).then(function (group) {
            return group.data
        })
    };

    this.delete = function (id) {
        return $http.delete("/management/groups/" + id).
        then(function (group) {
            return group.data
        })
    };

    this.create = function (group) {
        return $http.post("/management/groups/",
            group).then(function (group) {
            return group.data
        })
    }

    this.update = function (group) {
        return $http.put("/management/groups/"
            + group.id, group).then(function (group) {
            return group.data
        })
    }


}]);