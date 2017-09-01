pimsApp.controller('EntityListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'EntityModel', 'NgTableParams', function ($scope, $route, $routeParams,
                                                                                  $location,
                                                                                  $http,
                                                                                  $rootScope,
                                                                                  EntityModel,
                                                                                  NgTableParams) {
        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        var pageSize = 10;

        function PaginationObject(response) {
            return {

                currentPage: response.number,
                totalPages: response.totalPages,
                first: response.first,
                last: response.last

            }
        }

        function paginate_entites(page, size) {
            return EntityModel.findAll(entity_type_uuid, page, size).then(function (response) {
                return response;
            })
        }

        $scope.init = function () {
            return paginate_entites(0, pageSize).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response)

            }, function (error) {
                console.log(error);
            })
        };

        $scope.createAttributeSet = function () {
            $location.path("/entities/new");
        };

        $scope.getPage = function (page) {
            return paginate_entites(page, pageSize).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response)

            }, function (error) {
                console.log(error);
            })
        }


    }]);