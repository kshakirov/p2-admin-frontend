pimsServices.service('CustomSyncOperationModel', ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {

    var operations = [
        {
            name: "Sync All Products",
            code: "All",
            pipeline: 5,
            entityTypeId: "fd5b36e3-90a3-493b-a37d-c4f4262aec22",
            id: 1
        }
    ];

    this.findAll = function () {
        return $timeout(function () {
            return operations
        }, 500);
    };
    this.findOne = function (id) {
        return $timeout(function () {
            return operations[0];
        }, 500);
    };


}]);