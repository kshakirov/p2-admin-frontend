pimsApp.controller('FilterController' ,[ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'FilterModel', '$filter', function ($scope, $route, $routeParams,
                                                                     $location,
                                                                     $http,
                                                                     $rootScope,
                                                                  FilterModel,
                                                                            $filter) {

        $scope.types = ['OpenErp', 'Other'];
        
        $scope.init = function () {
            var id = $routeParams.id;
            if(id === "new"){

            }else {
                FilterModel.findOne(id).then(function (filter) {
                    filter.conditions = $filter('json')(filter.conditions, 4);

                    $scope.filter = filter;
                })
            }
        };

        $scope.updateFilter = function (filter) {
            var filter_to_save = {};
            angular.copy(filter, filter_to_save);
            filter_to_save.conditions = JSON.parse(filter.conditions);
            if(filter_to_save.hasOwnProperty("id")) {
                FilterModel.update(filter_to_save).then(function (response) {
                })
            }else{
                FilterModel.save(filter_to_save).then(function (response) {
                })
            }
        };

        $scope.deleteFilter = function (id) {
            FilterModel.delete(id).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/filters");
        }

    }]);