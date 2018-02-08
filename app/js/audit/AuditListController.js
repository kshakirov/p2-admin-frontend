pimsApp.controller('AuditListController', ['$scope', 'AuditModel',
    'usSpinnerService',
    function ($scope,
              AuditModel,
              usSpinnerService) {

        $scope.search_params = {};
        $scope.pageSize = 5;
        $scope.pageSizes = [5, 10, 25, 50, 100];
        $scope.search_query = {
            size: $scope.pageSize,
            from: 0,
            type: "individual",
            query: null,
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
                }else if (search_params[key] && search_params[key].length > 0) {
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

        $scope.init = function () {

            return paginate_entites($scope.search_query).then(function (response) {
                $scope.operations = response.content;
                $scope.pagination = new PaginationObject(response);

            }, function (error) {
                console.log(error);
                usSpinnerService.stop('spinner-2');
            })

        };


        $scope.getPage = function (page) {
            $scope.search_query.from = page;
            return paginate_entites($scope.search_query).then(function (response) {
                $scope.operations = response.content;
                $scope.pagination = new PaginationObject(response);
            }, function (error) {
                console.log(error);
            })
        };


        $scope.$watch('pageSize', function () {
            $scope.search_query.size = $scope.pageSize || 10;
            $scope.search_query.from = 0;
            $scope.init();
        });

        $scope.search = function () {
            $scope.search_query.from = 0;
            $scope.search_query.query = prep_search_params($scope.search_params);
            return paginate_entites($scope.search_query).then(function (response) {
                $scope.operations = response.content;
                $scope.pagination = new PaginationObject(response);
            }, function (error) {
                console.log(error);
            })
        };

        $scope.clear = function (search_params) {
            var keys = Object.keys(search_params);
            keys.map(function (key) {
                search_params[key] = "";
            });
            $scope.search();
        }
    }]);