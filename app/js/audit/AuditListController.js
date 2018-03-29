pimsApp.controller('AuditListController', ['$scope', 'AuditModel',
    'usSpinnerService', '$uibModal', 'AuditAggregatinService', '$q',
    'CustomSyncOperationModel', 'EntityTypeModel','AuditListService',
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
                    AuditListService.dtoAuditRecords(response.content,$scope.entityTypes ,$scope.customOperations );
                $scope.pagination = new PaginationObject(response);

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
                    AuditListService.dtoAuditRecords(response.content,$scope.entityTypes ,$scope.customOperations );
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
            var keys = Object.keys(search_params);
            keys.map(function (key) {
                search_params[key] = "";
            });
            this.selects = AuditAggregatinService.clearSelects(this.selects);
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

        $scope.$watch('selects.syncOperationType', function (old, n) {
            if (n !== old) {
                if ($scope.selects.syncOperationType && $scope.selects.syncOperationType[0])
                    $scope.search_query.query.syncOperationType = $scope.selects.syncOperationType[0].key;
                else
                    delete $scope.search_query.query.syncOperationType;
                base_search($scope.search_query)
            }
        });

        $scope.$watch('selects.syncOperationId', function (n, old) {
            if (n !== old) {
                if (angular.isUndefined(n) || n.length == 0) {
                    delete $scope.search_query.query.syncOperationId;
                }
                else {
                    $scope.search_query.query.syncOperationId = $scope.selects.syncOperationId[0].key;
                    AuditAggregatinService.createAggregateFilters($scope.selects, 'syncOperationId')
                }
                base_search($scope.search_query)
            }
        });

        $scope.$watch('selects.entityTypeId', function (old, n) {
            if (n !== old) {
                if ($scope.selects.entityTypeId && $scope.selects.entityTypeId[0])
                    $scope.search_query.query.entityTypeId = $scope.selects.entityTypeId[0].key;
                else
                    delete $scope.search_query.query.entityTypeId;
                base_search($scope.search_query)
            }
        })
        ;

        $scope.$watch('selects.user', function (old, n) {
            if (n !== old) {
                $scope.search_query.query.user = $scope.selects.user[0].key;
                base_search($scope.search_query)
            }
        });

        function base_search(search_query) {
            $scope.search_query.from = 0;
            return reget_aggregation_data(search_query).then(function (promises) {
            paginate_entites(search_query).then(function (response) {
                $scope.aggregations = AuditAggregatinService.decorateSelects(promises);
                $scope.aggregationsReady = true;
                $scope.entityTypes = promises[1];
                $scope.customOperations = promises[2];
                $scope.operations =
                    AuditListService.dtoAuditRecords(response.content,$scope.entityTypes ,$scope.customOperations );
                $scope.pagination = new PaginationObject(response);
                reget_aggregation_data(search_query).then(function () {

                })
            }, function (error) {
            })});
        }


    }]);