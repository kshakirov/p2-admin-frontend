pimsServices.service('AuditListService', [ function () {
    this.dtoAuditRecords = function (records, entity_types, custom_operations) {
        return records.map(function (record) {
            var co = custom_operations.find(function (co) {
                return co.id == record.syncOperationId;
            });
            if (co)
                record.syncOperationId = co.name;
            var et = entity_types.find(function (et) {
                return et.uuid == record.entityTypeId;
            })
            if (et)
                record.entityTypeId = et.name;
            return record;

        })
    }
}]);