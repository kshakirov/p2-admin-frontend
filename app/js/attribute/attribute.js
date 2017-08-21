pimsApp.controller('AttributeCtrl', function($scope, $route, $routeParams,
                                             $location,
                                             $http,
                                             $rootScope,
                                             AttributeModel,
                                             NgTableParams) {
    console.log("PimsApp AttributeCtrl");
    $scope.init = function () {
        if($routeParams.uuid){
            AttributeModel.findOne($routeParams.uuid).then(function (attribute) {
                console.log(attribute)
            })
        }else{
            AttributeModel.all().then(function (attributes) {
                $scope.tableParams = new NgTableParams({}, { dataset: attributes});
            })
        }

    }


})