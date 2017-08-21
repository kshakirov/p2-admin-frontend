pimsServices.service('AttributeModel', function ($http, $rootScope) {
    this.all = function () {
        return $http.get("/pims/rest/entity-types/" + $rootScope.pims.entities.current.uuid
            + "/attributes").then(function (attributes) {
            console.log(attributes);
            return attributes.data
        })
    }

    this.findOne = function (uuid) {
        return $http.get("/pims/rest/entity-types/" + $rootScope.pims.entities.current.uuid
            + "/attributes/" + uuid).then(function (attribute) {
            console.log(attribute);
            return attribute.data
        })
    }
})