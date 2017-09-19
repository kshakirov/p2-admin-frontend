pimsServices.service('CustomSyncOperationModel', ['$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {

    var operations = [
        {
            name: "Sync All Products 2 Elastic",
            code: "All",
            pipe: "Pims 2 Elastic Pipe",
            schema: "Default",
            entityTypeId: "Product",
            filter: "price > 100",
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