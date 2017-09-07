pimsApp.controller('ConverterController' ,[ '$scope', '$route', '$routeParams',
    '$location',  '$http','$rootScope', 'ConverterModel',  function ($scope, $route, $routeParams,
                                                                     $location,
                                                                     $http,
                                                                     $rootScope,
                                                                     ConverterModel) {

        $scope.init = function () {
            var id = $routeParams.id;
            if(id === "new"){

            }else {
                ConverterModel.findOne(id).then(function (converter) {
                    $scope.converter = converter;
                })
            }
        };

        $scope.updateConverter = function (converter) {
            if(converter.hasOwnProperty("id")) {
                ConverterModel.update(converter).then(function (response) {
                })
            }else{
                ConverterModel.save(converter).then(function (response) {
                })
            }
        };

        $scope.deleteConverter = function (id) {
            ConverterModel.delete(id).then(function (response) {
            })
        };

        $scope.cancel = function () {
            $location.path("/converters");
        }

    }]);