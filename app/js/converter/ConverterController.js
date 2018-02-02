pimsApp.controller('ConverterController', ['$scope', '$route', '$routeParams',
    '$location', '$http', '$rootScope', 'ConverterModel', 'ngNotify',
    function ($scope, $route, $routeParams,
              $location,
              $http,
              $rootScope,
              ConverterModel,
              ngNotify) {

        $scope.types = ['Converter', 'Validator'];
        $scope.languages = [
            {name: 'Java Script', mode: "javascript"},
            {name: "Python", mode: "python"},
            {name: 'Ruby', mode: "ruby"},
            {name: 'Groovy', mode: "groovy"}
        ];
        $scope.init = function () {
            var id = $routeParams.id;
            if (id === "new") {

            } else {
                ConverterModel.findOne(id).then(function (converter) {
                    $scope.converter = converter;
                })
            }
        };

        $scope.updateConverter = function (converter) {
            if (converter.hasOwnProperty("id")) {
                ConverterModel.update(converter).then(function (response) {
                    ngNotify.set("Converter Saved Successfully", 'success');
                })
            } else {
                ConverterModel.save(converter).then(function (response) {
                    ngNotify.set("Converter Created Successfully", 'success');
                })
            }
        };

        $scope.deleteConverter = function (id) {
            ConverterModel.delete(id).then(function (response) {
                ngNotify.set("Converter Deleted Successfully", 'success');
            })
        };

        $scope.cancel = function () {
            $location.path("/converters");
        }

    }]);