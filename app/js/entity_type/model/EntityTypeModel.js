pimsServices.service('EntityTypeModel', ['$http', '$rootScope', function ($http, $rootScope) {
    this.findAll = function (et_uuid, page, size) {
        return $http.get("/rest/entity-types/").then(function (entities) {
            return entities.data
        })
    };

    this.findOne = function (et_uuid, uuid) {
        return $http.get("/rest/entity-types/" + et_uuid).then(function (entities) {
            return entities.data
        })
    };


}]);