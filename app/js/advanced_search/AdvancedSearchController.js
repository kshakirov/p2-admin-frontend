pimsApp.controller('AdvancedSearchController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'AdvancedSearchModel', 'AttributeSetModel',
    'AttributeModel', 'usSpinnerService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              AdvancedSearchModel,
              AttributeSetModel,
              AttributeModel,
              usSpinnerService) {
        var entity_type_uuid = $rootScope.pims.entities.current.uuid,
            query = 'propertyName=role&propertyValues=search';
        $scope.search_params = {};
        $scope.pageSize = 10;
        $scope.pageSizes = [10,25,50,100];
        $scope.search_query = {
            size: $scope.pageSize,
            from: 0,
            type: entity_type_uuid,
            query: null,
        };



        function PaginationObject(response) {
            return {

                currentPage: response.number,
                totalPages: Math.ceil(response.totalPages),
                first: response.first,
                last: response.last,
                totalRecords:  response.totalPages * $scope.pageSize
            }
        }

        function paginate_entites(search_query) {
            return AdvancedSearchModel.findAll(search_query).then(function (response) {
                return response;
            })
        }

        $scope.init = function () {
            usSpinnerService.spin('spinner-2');
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                $scope.layout = attribute_set[0].attributes;
                return paginate_entites($scope.search_query).then(function (response) {
                    $scope.entities = response.content;
                    $scope.pagination = new PaginationObject(response);
                    usSpinnerService.stop('spinner-2');

                })
            })

        };

         $scope.getPage = function (page) {
            usSpinnerService.spin('spinner-2');
            $scope.search_query.from = page;
            return paginate_entites($scope.search_query).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response);
                usSpinnerService.stop('spinner-2');
            }, function (error) {
                console.log(error);
            })
        };

        $scope.search = function () {
            usSpinnerService.spin('spinner-2');
            $scope.search_query.from = 0;
            $scope.search_query.query = $scope.search_params;
            return paginate_entites($scope.search_query).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response);
                usSpinnerService.stop('spinner-2');
            })
        };

        $scope.redirectToEntity = function (id) {
            console.log(id);
            $location.url('/entities/' + id)
        };

        $scope.$watch('pageSize', function () {
            $scope.search_query.size = $scope.pageSize || 10;
            $scope.search_query.from = 0;
            $scope.init();
        })
    }]);


