pimsApp.controller('EntityListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'EntityModel', 'NgTableParams', 'usSpinnerService',
    'MessageService', 'AttributeSetModel', 'ngNotify', 'EntityListService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              EntityModel,
              NgTableParams,
              usSpinnerService,
              MessageService,
              AttributeSetModel,
              ngNotify,
              EntityListService) {

        var entity_type_uuid = $rootScope.pims.entities.current.uuid,
            pageSize = 10,
            query = 'propertyName=role&propertyValues=base_search';
        $rootScope.message = MessageService.prepareMessage();
        $scope.search_params = {};
        $scope.pageSize = 10;
        $scope.pageSizes = [10, 25, 50, 100];

        function PaginationObject(response) {
            return {
                totalPages: response.totalPages,
                first: response.first,
                content: response.content,
                last: response.last,
                currentPage: response.number,
                totalRecords: response.totalElements

            }
        }

        function paginate_entites(body) {
            return EntityModel.getPage(entity_type_uuid, body).then(function (response) {
                return response;
            })
        }


        function paginate_entites_query(page, size, query) {
            return EntityModel.search(entity_type_uuid, query, page, size).then(function (response) {
                return response;

            })
        }


        function prepare_params(search_params) {
            var keys = Object.keys(search_params);
            keys = keys.filter(function (k) {
                if (search_params[k] && search_params[k].length > 0)
                    return k;
            });
            keys = keys.map(function (k) {
                return "attributeId=" + k + "&attributeValue=" + "%25" + search_params[k] + "%25";
            });
            if (keys.length == 0)
                return false;
            else
                return keys.join("&");
        }


        function has_attribute_set(attributes_set) {
            if (attributes_set && attributes_set.length > 0)
                return true;
            return false
        }

        $scope.init = function () {
            usSpinnerService.spin('spinner-1');
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                if (has_attribute_set(attribute_set)) {
                    $scope.layout = attribute_set[0].attributes;
                    return paginate_entites(EntityListService.createBody($scope.pageSize,$scope.layout))
                        .then(function (response) {
                            $scope.entities = response.content;
                            $scope.pagination = new PaginationObject(response);
                            usSpinnerService.stop('spinner-1');

                        }, function (error) {
                            MessageService.setDangerMessage($rootScope.message,
                                "You are not authorized");
                            usSpinnerService.stop('spinner-1');
                            console.log(error);
                        })
                } else {
                    usSpinnerService.stop('spinner-1');
                    ngNotify.set("No Fields To Render. Please, Create Attribute Set with Role 'base_search'" +
                        "and Add Attributes as Columns", {
                        position: 'top',
                        type: 'error',
                        duration: 20000,
                        sticky: true
                    });
                }
            })
        };

        $scope.createEntity = function () {
            $location.path("/entities/new");
        };

        $scope.getFirstPage = function (page) {
            var body = EntityListService.getFirstPage();
            getPage(body,page)
        };


        $scope.getLastPage = function (page) {
            var body = EntityListService.getLastPage();
            getPage(body,page)
        };

        $scope.getNextPage = function (page) {
            var body = EntityListService.getNextPage($scope.pagination);
            getPage(body,page)
        };

        $scope.getPrevPage = function (page) {
            var body = EntityListService.getPrevPage($scope.pagination);
            getPage(body,page)
        };

        function process_response(response) {
            $scope.entities = response.content;
            $scope.pagination = new PaginationObject(response);
            usSpinnerService.stop('spinner-1');

        }
        var errorHandler = function process_error(error) {
            console.log(error);
            console.log("The promise is not resolved")
        };

        function getPage(body, page) {
            usSpinnerService.spin('spinner-1');
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                $scope.layout = attribute_set[0].attributes;
                var query = prepare_params($scope.search_params);
                if (query) {
                    return paginate_entites_query(page, pageSize, query).then(function (response) {
                        process_response(response)
                    },errorHandler)
                } else {
                    return paginate_entites(body, query).then(function (response) {
                        process_response(response)
                    }, errorHandler)
                }
            })
        }

        $scope.clearQuery = function () {
            $scope.search_params = {};
            $scope.getFirstPage();
        };

        $scope.search = function (page) {
            usSpinnerService.spin('spinner-1');
            AttributeSetModel.search(entity_type_uuid, query).then(function (attribute_set) {
                $scope.layout = attribute_set[0].attributes;
                var query = prepare_params($scope.search_params);
                return paginate_entites_query(0, pageSize, query).then(function (response) {
                  process_response(response)
                },errorHandler)
            })
        };

        $scope.$watch('pageSize', function () {
            pageSize = $scope.pageSize || 10;
            $scope.init();
        })

    }

]);