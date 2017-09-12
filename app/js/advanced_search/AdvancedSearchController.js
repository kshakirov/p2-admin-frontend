pimsApp.controller('AdvancedSearchController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'AdvancedSearchModel', 'AttributeSetModel',
    'AttributeModel',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              AdvancedSearchModel,
              AttributeSetModel,
              AttributeModel) {
        var entity_type_uuid = 'fd5b36e3-90a3-493b-a37d-c4f4262aec22',
            query = 'properties.role=search';
        $scope.page_size = 10;
        $scope.search_query = {
            size: $scope.page_size,
            from: 0,
            type: entity_type_uuid,
            query: null
        };

        function PaginationObject(response) {
            return {

                currentPage: response.number,
                totalPages: response.totalPages,
                first: response.first,
                last: response.last

            }
        }

        function paginate_entites(search_query) {
            return AdvancedSearchModel.findAll(search_query).then(function (response) {
                return response;
            })
        }

        $scope.init = function () {
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                $scope.layout = attribute_set[0].attributes;
                return paginate_entites($scope.search_query).then(function (response) {
                    $scope.entities = response.content;
                    $scope.pagination = new PaginationObject(response)

                })
            })

        };

        $scope.getPage = function (page) {
            $scope.search_query.from = page;
            return paginate_entites($scope.search_query).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response)

            }, function (error) {
                console.log(error);
            })
        }
    }]);


