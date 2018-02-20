function createDiffController(operation) {
    var opertaion = operation;
    var createDiffController = function ($uibModalInstance, $scope, AttributeModel, $q) {



        $scope.init = function () {
            $scope.diff = operation.diff;
        };



        $scope.ok = function () {
            var result = {};


            $uibModalInstance.close(result);

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("Cancel");
        };
    };
    createDiffController.$inject = ['$uibModalInstance', '$scope', 'AttributeModel', '$q'];
    return createDiffController;
}

