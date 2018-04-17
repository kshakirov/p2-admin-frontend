pimsServices.service('AuditListService', ['AuditAggregatinService', function (AuditAggregatinService) {

    function is_changes(n, old) {
        if (angular.isUndefined(n) && old && old.hasOwnProperty('length') && old.length == 0)
            return false;
        else if (n !== old)
            return true;
        return false;
    }

    this.dtoAuditRecords = function (records, entity_types, custom_operations) {
        return records.map(function (record) {
            var co = custom_operations.find(function (co) {
                return co.id == record.syncOperationId;
            });
            if (co)
                record.syncOperationId = co.name;
            var et = entity_types.find(function (et) {
                return et.uuid == record.entityTypeId;
            });
            if (et)
                record.entityTypeId = et.name;
            return record;

        })
    };
    this.watchSyncOperationType = function (base_search) {
        console.log("Creating Watcher After Operation Type [create, update, etc]");
        return function (old, n) {
            if (is_changes(n, old)) {
                if (this.selects.syncOperationType && this.selects.syncOperationType[0])
                    this.search_query.query.syncOperationType = this.selects.syncOperationType[0].key;
                else
                    delete this.search_query.query.syncOperationType;
                base_search(this.search_query)
            }
        }
    };

    this.watchSyncOperationId = function (base_search) {
        console.log("Creating Watcher After Operation Id");
        return function (n, old) {
            if (is_changes(old, n)) {
                if (angular.isUndefined(n) || n.length == 0) {
                    delete this.search_query.query.syncOperationId;
                }
                else {
                    this.search_query.query.syncOperationId = this.selects.syncOperationId[0].key;
                    AuditAggregatinService.createAggregateFilters(this.selects, 'syncOperationId')
                }
                base_search(this.search_query)
            }
        }
    };
    this.watchEntityTypeId = function (base_search) {
        console.log("Creating Watcher After EntityType Id ");
        return function (n, old) {
            if (is_changes(old, n)) {
                if (this.selects.entityTypeId && this.selects.entityTypeId[0])
                    this.search_query.query.entityTypeId = this.selects.entityTypeId[0].key;
                else
                    delete this.search_query.query.entityTypeId;
                base_search(this.search_query)
            }
        }
    };
    this.watchUser = function (base_search) {
        console.log("Creating Watcher After User");
        return function (n, old) {
            if (is_changes(old, n)) {
                if(n && n.length > 0)
                    this.search_query.query.user = this.selects.user[0].key;
                else
                    delete this.search_query.query.user;
                base_search(this.search_query)
            }
        }
    }


}]);