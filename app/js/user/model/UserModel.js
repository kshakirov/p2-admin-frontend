pimsServices.service('UserModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function () {
        return $http.get("/management/users/page/0").then(function (users) {
            return users.data.content
        })
    };

    this.findOne = function (id) {
        return $http.get("/management/users/" + id).then(function (user) {
            return user.data;
        })
    };

    this.delete = function (id) {
        return $http.delete("/management/users/" + id).
        then(function (user) {
            return user.data
        })
    };

    this.create = function (user) {
        return $http.post("/management/users/",
            user).then(function (user) {
            return user.data
        })
    }

    this.update = function (user) {
        return $http.put("/management/users/"
            + user.id, user).then(function (user) {
            return user.data
        })
    }


}]);