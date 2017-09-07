pimsServices.service('EntityTypeResolver',[ function() {
    this.initItem = function (entityType) {
        var item = {};
        item[entityType.uuid] = {
            name: entityType.name,
            write: {
                url: "/entityType/" + entityType.uuid,
                method: 'POST'
            },
            read: {
                url: "/entityType/" + entityType.uuid + "/",
                method: "GET"
            }
        }
        return item;
    }

}]);