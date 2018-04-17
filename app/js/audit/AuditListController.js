pimsApp.controller('AuditListController', ['$scope', 'AuditModel',
    'usSpinnerService', '$uibModal', 'AuditAggregatinService', '$q',
    'CustomSyncOperationModel', 'EntityTypeModel', 'AuditListService',
    function ($scope,
              AuditModel,
              usSpinnerService,
              $uibModal,
              AuditAggregatinService,
              $q,
              CustomSyncOperationModel,
              EntityTypeModel,
              AuditListService) {

        $scope.search_params = {};
        $scope.selects = {};
        $scope.pageSize = 5;
        $scope.pageSizes = [5, 10, 25, 50, 100];
        $scope.search_query = {
            size: $scope.pageSize,
            from: 0,
            type: "individual",
            query: {},
            sort: [{'startedAt': {"order": "desc", "mode": "avg"}}]
        };

        $scope.inputs = [
            {name: 'customOperationName'},
            {name: 'entityTypeId'},
        ];

        var watchers_hash = {};

        function PaginationObject(response) {
            return {

                currentPage: response.number,
                totalPages: Math.ceil(response.totalPages),
                first: response.first,
                last: response.last,
                totalRecords: response.totalPages * $scope.pageSize
            }
        }

        function paginate_entites(search_query) {
            return AuditModel.findAll(search_query);
        }

        function prep_search_params(s_p) {
            var search_params = {};
            angular.copy(s_p, search_params);
            var keys = Object.keys(search_params);
            keys.map(function (key) {
                if (search_params[key] && angular.isNumber(search_params[key])) {
                    search_params[key] = search_params[key]
                } else if (search_params[key] && search_params[key].length > 0) {
                    search_params[key] = "*" + search_params[key] + "*"
                }

            });
            return search_params;
        }

        function get_entity_filter(entity) {
            return {
                entityId: entity.uuid
            }
        }

        function get_aggregation_data() {
            var async_ops = [];
            async_ops.push(AuditModel.findAggregations(AuditAggregatinService.requestData()));
            async_ops.push(EntityTypeModel.findAll());
            async_ops.push(CustomSyncOperationModel.findAll());
            return $q.all(async_ops)
        }


        function reget_aggregation_data(search_query) {
            var data = AuditAggregatinService.requestData(),
                async_ops = [];
            data.query = search_query;
            async_ops.push(AuditModel.findAggregations(data));
            async_ops.push(EntityTypeModel.findAll());
            async_ops.push(CustomSyncOperationModel.findAll());
            return $q.all(async_ops)

        }

        $scope.init = function () {
            return get_aggregation_data().then(function (promises) {
                paginate_entites($scope.search_query).then(function (response) {
                    $scope.aggregations = AuditAggregatinService.decorateSelects(promises);
                    $scope.aggregationsReady = true;
                    $scope.entityTypes = promises[1];
                    $scope.customOperations = promises[2];
                    $scope.operations =
                        AuditListService.dtoAuditRecords(response.content, $scope.entityTypes, $scope.customOperations);
                    $scope.pagination = new PaginationObject(response);
                    watchers_hash = create_watchers(watchers_hash);


                }, function (error) {
                    console.log(error);
                    usSpinnerService.stop('spinner-2');
                })
            });

        };


        $scope.getPage = function (page) {
            $scope.search_query.from = page;
            return paginate_entites($scope.search_query).then(function (response) {
                $scope.operations =
                    AuditListService.dtoAuditRecords(response.content, $scope.entityTypes, $scope.customOperations);
                $scope.pagination = new PaginationObject(response);
            }, function (error) {
                console.log(error);
            })
        };


        $scope.$watch('pageSize', function (n, old) {
            if (n !== old) {
                $scope.search_query.size = $scope.pageSize || 10;
                $scope.search_query.from = 0;
                $scope.init();
            }
        });

        $scope.search = function () {
            $scope.search_query.query = prep_search_params($scope.search_params);
            return base_search($scope.search_query)
        };

        $scope.clear = function (search_params) {
            remove_watchers(watchers_hash);
            var keys = Object.keys(search_params);
            keys.map(function (key) {
                search_params[key] = "";
            });
            this.selects = AuditAggregatinService.clearSelects(this.selects);
            watchers_hash = create_watchers(watchers_hash);
            $scope.search();
        };

        $scope.visualizeDiff = function (item) {
            var $uibModalInstance = modalInstance = $uibModal.open({
                templateUrl: 'partial/entity/audit_diff_modal',
                controller: createDiffController(item),
                resolve: {
                    user: function () {
                        return "Return";
                    }
                }
            });
            $uibModalInstance.result.then(function (reference) {
            }, function () {
            });

        };


        function create_watchers(watchers_hash) {
            watchers_hash.syncOperationType =
                $scope.$watch('selects.syncOperationType',
                    AuditListService.watchSyncOperationType(base_search).bind($scope));
            watchers_hash.syncOperationId =
                $scope.$watch('selects.syncOperationId',
                    AuditListService.watchSyncOperationId(base_search).bind($scope));
            watchers_hash.entityTypeId =
                $scope.$watch('selects.entityTypeId',
                    AuditListService.watchEntityTypeId(base_search).bind($scope));
            watchers_hash.user =
                $scope.$watch('selects.user',
                    AuditListService.watchUser(base_search).bind($scope));
            return watchers_hash;
        }

        function remove_watchers(watchers_hash) {
            Object.keys(watchers_hash).map(function (key) {
                console.log("Deregistering watcher " + key);
                watchers_hash[key]();
            })
        }


        function base_search(search_query) {
            $scope.search_query.from = 0;
            return reget_aggregation_data(search_query).then(function (promises) {
                paginate_entites(search_query).then(function (response) {
                    $scope.aggregations = AuditAggregatinService.decorateSelects(promises);
                    $scope.aggregationsReady = true;
                    $scope.entityTypes = promises[1];
                    $scope.customOperations = promises[2];
                    $scope.operations =
                        AuditListService.dtoAuditRecords(response.content, $scope.entityTypes, $scope.customOperations);
                    $scope.pagination = new PaginationObject(response);

                }, function (error) {
                })
            });
        }


    }]);