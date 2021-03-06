pimsServices.service('AttributeSetModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (et_uuid) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/attribute-sets").then(function (attribute_sets) {
            return attribute_sets.data
        })
    };

    this.search = function (et_uuid, params_string) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/attribute-sets/findByProperty/dto?" + params_string).then(function (attribute_sets) {
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

    this.update = function (et_uuid, attribute) {
        return $http.put("/rest/entity-types/" + et_uuid
            + "/attribute-sets/" + attribute.uuid, attribute).then(function (attribute_sets) {
            return attribute_sets.data
        })
    }

    this.create = function (et_uuid, attribute) {
        return $http.post("/rest/entity-types/" + et_uuid
            + "/attribute-sets", attribute).then(function (attribute_sets) {
            return attribute_sets.data
        })
    }


}]);