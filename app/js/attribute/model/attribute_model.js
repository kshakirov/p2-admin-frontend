pimsServices.service('AttributeModel', function ($http, $rootScope) {
    this.findAll = function (et_uuid) {
        return $http.get("/pims/rest/entity-types/" + et_uuid
            + "/attributes").then(function (attributes) {
            console.log(attributes);
            return attributes.data
        })
    };

    this.findOne = function (et_uuid, uuid) {
        return $http.get("/pims/rest/entity-types/" + et_uuid
            + "/attributes/" + uuid).then(function (attribute) {
            console.log(attribute);
            return attribute.data
        })
    };

    this.delete = function (uuid) {

    };

    this.save = function () {

    }


});