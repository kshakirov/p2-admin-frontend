pimsServices.service('AttributeModel', function ($http, $rootScope) {
    this.findAll = function (et_uuid) {
        return $http.get("/pims/rest/entity-types/" + et_uuid
            + "/attributes").then(function (attributes) {
            return attributes.data
        })
    };

    this.findOne = function (et_uuid, uuid) {
        return $http.get("/pims/rest/entity-types/" + et_uuid
            + "/attributes/" + uuid).then(function (attribute) {
            return attribute.data
        })
    };

    this.delete = function (et_uuid, uuid) {
        return $http.delete("/pims/rest/entity-types/" + et_uuid
            + "/attributes/" + uuid).then(function (attribute) {
            return attribute.data
        })
    };

    this.save = function (et_uuid, attribute) {
        return $http.post("/pims/rest/entity-types/" + et_uuid
            + "/attributes", attribute).then(function (attribute) {
            return attribute.data
        })
    }


});