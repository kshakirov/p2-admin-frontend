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
                url: "/entity-types/" + entityType.uuid + "/entities/bulk/import",
                method: 'POST'
            },
            read: {
                url: "/entity-types/" + entityType.uuid + "/entities/uuids",
                method: "GET"
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
            }
        ]
    }

}]);