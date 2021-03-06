pimsServices.service('EntityTypeResolver', [function () {
    this.initItem = function (entityType, helpers, helper_id) {
        var item = {};
        if (helper_id) {
            var helper = helpers.find(function (h) {
                if (h.id === helper_id) {
                    return true
                }
            });
            item = helper.fill_up(entityType)
        }
        return item;
    };

    var fill_up_pims_batch = function (entityType) {
        var item = {};
        item[entityType.uuid] = {
            name: entityType.name,
            write: {
                url: "/entity-types/" + entityType.uuid + "/entities/import/bulk",
                method: 'POST'
            },
            read: {
                url: "/entity-types/" + entityType.uuid + "/entities/uuids",
                method: "GET"
            },
            filter: {
                url: "/entity-types/" + entityType.uuid + "/entities/getIdsByFilters",
                method: "POST"
            }
        };
        return item
    };

    var fill_up_pims_individual = function (entityType) {
        var item = {};
        item[entityType.uuid] = {
            name: entityType.name,
            write: {
                url: "/entity-types/" + entityType.uuid + "entities",
                method: 'POST'
            },
            read: {
                url: "/entity-types/" + entityType.uuid + "/entities",
                method: "GET"
            }
        };
        return item
    };

    var fill_up_pims_batch_dto = function (entityType) {
        var item = {};
        item[entityType.uuid] = {
            name: entityType.name,
            write: {
                url: "/entity-types/" + entityType.uuid + "/entities/import/bulk",
                method: 'POST'
            },
            read: {
                url: "/entity-types/" + entityType.uuid + "/entities/uuids/dto",
                method: "POST"
            },
            filter: {
                url: "/entity-types/" + entityType.uuid + "/entities/getIdsByFilters",
                method: "POST"
            }
        };
        return item
    };

    var fill_up_pims_elastic = function (entityType) {
        var item = {};
        item[entityType.uuid] = {
            name: entityType.name,
            write: {
                url: "/pims-staging/" + entityType.uuid,
                method: 'PUT'
            },
            read: {
                url: "/",
                method: "GET"
            }
        };
        return item
    };


    var fill_up_pims_binary = function (entityType) {
        var item = {};
        item[entityType.uuid] = {
            name: entityType.name,
            write: {
                url: "/entity-types/" + entityType.uuid + "/entities/import/bulk?joinArrays=true",
                method: 'POST'
            },
            read: {
                url: "/entity-types/" + entityType.uuid + "/entities/uuids",
                method: "GET"
            },
            filter: {
                url: "/entity-types/" + entityType.uuid + "/entities/getIdsByFilters",
                method: "POST"
            }
        };
        return item
    };


    this.createHelpers = function () {
        return [
            {
                name: "Pims (Batch)",
                id: 1,
                fill_up: fill_up_pims_batch
            },
            {
                name: "Elastic",
                id: 2,
                fill_up: fill_up_pims_elastic
            },
            {
                name: "Pims (Individual)",
                id: 3,
                fill_up: fill_up_pims_individual
            },
            {
                name: "Pims (DTO)",
                id: 4,
                fill_up: fill_up_pims_batch_dto
            },
            {
                name: "Pims (Binary)",
                id: 5,
                fill_up: fill_up_pims_binary
            },
        ]
    }

}]);