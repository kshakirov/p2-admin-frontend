pimsServices.service('AttributeModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (et_uuid) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/attributes").then(function (attributes) {
            return attributes.data
        })
    };

    this.findOne = function (et_uuid, uuid) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/attributes/" + uuid).then(function (attribute) {
            return attribute.data
        })
    };

    this.findOneDto = function (et_uuid, uuid) {
        return $http.get("/rest/entity-types/" + et_uuid
            + "/attributes/" + uuid + "/dto").then(function (attribute) {
            return attribute.data
        })
    };

    this.delete = function (et_uuid, uuid) {
        return $http.delete("/rest/entity-types/" + et_uuid
            + "/attributes/" + uuid).then(function (attribute) {
            return attribute.data
        })
    };

    this.create = function (et_uuid, attribute) {
        return $http.post("/rest/entity-types/" + et_uuid
            + "/attributes", attribute).then(function (attribute) {
            return attribute.data
        })
    }

    this.update = function (et_uuid, attribute) {
        return $http.put("/rest/entity-types/" + et_uuid
            + "/attributes/" + attribute.uuid, attribute).then(function (attribute) {
            return attribute.data
        })
    }

    this.searchUpdate = function (data) {
        return $http.post("/control/search/make_sortable", data).then(function (attribute) {
            return attribute.data
        })
    }


}]);