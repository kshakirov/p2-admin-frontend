pimsServices.service('AttributeSetModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (et_uuid) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/attribute-sets").then(function (attribute_sets) {
            return attribute_sets.data
        })
    };

    this.findOne = function (et_uuid, uuid) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/attribute-sets/" + uuid + '/dto').then(function (attribute_sets) {
            return attribute_sets.data
        })
    };

    this.delete = function (et_uuid, uuid) {
        return $http.delete("/rest/entity-types/" + et_uuid
            + "/attribute-sets/" + uuid).then(function (attribute_sets) {
            return attribute_sets.data
        })
    };

    this.save = function (et_uuid, attribute) {
        return $http.put("/rest/entity-types/" + et_uuid
            + "/attribute-sets", attribute).then(function (attribute_sets) {
            return attribute_sets.data
        })
    }


}]);