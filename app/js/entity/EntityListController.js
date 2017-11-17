pimsApp.controller('EntityListController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'EntityModel', 'NgTableParams', 'usSpinnerService',
    'MessageService',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              EntityModel,
              NgTableParams,
              usSpinnerService,
              MessageService) {
        var entity_type_uuid = $rootScope.pims.entities.current.uuid;
        var pageSize = 10;
        $rootScope.message = MessageService.prepareMessage();

        function PaginationObject(response) {
            return {
                totalPages: response.totalPages,
                first: response.first,
                last: response.last,
                currentPage: response.number

            }
        }

        function paginate_entites(page, size) {
            return EntityModel.findAll(entity_type_uuid, page, size).then(function (response) {
                return response;
            })
        }

        $scope.init = function () {
            usSpinnerService.spin('spinner-1');
            return paginate_entites(0, pageSize).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response);
                usSpinnerService.stop('spinner-1');

            }, function (error) {
                MessageService.setDangerMessage($rootScope.message,
                    "You are not authorized");
                usSpinnerService.stop('spinner-1');
                console.log(error);
            })
        };

        $scope.createEntity = function () {
            $location.path("/entities/new");
        };

        $scope.getPage = function (page) {
            usSpinnerService.spin('spinner-1');
            return paginate_entites(page, pageSize).then(function (response) {
                $scope.entities = response.content;
                $scope.pagination = new PaginationObject(response);
                usSpinnerService.stop('spinner-1');

            }, function (error) {
                console.log(error);
            })
        }


    }]);