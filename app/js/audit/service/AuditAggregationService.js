pimsServices.service('AuditAggregatinService', ['AuditModel', function (AuditModel) {
    var aggregations = {},
        terms_regexp = /terms____/;

    var request_data = {
        type: 'individual',

        fields: [
            {
                field: 'syncOperationType',
                type: 'terms'
            },
            {
                field: 'syncOperationId',
                type: 'terms'
            },
            {
                field: 'entityTypeId',
                type: 'terms'
            },
            {
                field: 'user',
                type: 'terms'
            },
            {
                field: 'startedAt',
                type: 'min'
            },
            {
                field: 'startedAt',
                type: 'max'
            },
            {
                field: 'finishedAt',
                type: 'min'
            },
            {
                field: 'finishedAt',
                type: 'max'
            }
        ]
    };

    function is_terms_key(key) {
        return key.search('terms____') >= 0
    }

    function create_agg_key(term) {
        return term.replace(terms_regexp, "")
    }

    function map_name_to_upper_case(buckets) {
        return buckets.map(function (b) {
            b.name = b.key.toString().toUpperCase();
            return b;
        })
    }

    function map_id_to_name(buckets, names) {
        return buckets.map(function (b) {
            b.name = names.find(function (n) {
                if (n.id === b.key || n.uuid === b.key)
                    return true;
            });
            b.name = b.name.name;
            return b;
        })
    }

    function create_terms_inputs(aggs) {
        var keys = Object.keys(aggs),
            terms = keys.filter(function (a) {
                if (is_terms_key(a))
                    return true;
                return false;
            });
        terms.map(function (t) {
            aggregations[create_agg_key(t)] = aggs[t].buckets;
        });
        return aggregations;
    }

    function create_aggs_selects(aggregations) {
        aggregations = create_terms_inputs(aggregations);
        console.log(aggregations);
        return aggregations
    }

    this.requestData = function () {
        return request_data;
    };

    this.clearSelects = function (selects) {
        var keys = Object.keys(selects);
        keys.forEach(function (k) {
            selects[k] = [];
        })
        return selects;
    };


    this.decorateSelects = function (promises) {
        var selects = create_terms_inputs(promises[0].aggregations);
        selects.syncOperationType = map_name_to_upper_case(selects.syncOperationType);
        selects.syncOperationId = map_id_to_name(selects.syncOperationId, promises[2]);
        selects.entityTypeId = map_id_to_name(selects.entityTypeId, promises[1]);
        selects.user = map_name_to_upper_case(selects.user);

        return selects
    };

    this.createAggregateFilters = function (selects, current_select_key) {
        var filters = Object.keys(selects).filter(function (s) {
            if (s !== current_select_key)
                return true;
        });
        filters = filters.map(function (key) {
            return selects[key].map(function (s) {
                var t = {
                    term: {}
                };
                t[key] = s.key;
                return t
            })
        });
        return filters
    }


}]);